import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id || session.subscription_data?.metadata?.user_id;
        if (!userId) break;

        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const now = new Date();
        const endDate = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        await supabase.from('assinaturas').insert({
          user_id: userId,
          status: 'ativa',
          data_inicio: now.toISOString(),
          data_fim: endDate,
          stripe_id: subscriptionId,
          valor: subscription.items.data[0]?.price?.unit_amount
            ? subscription.items.data[0].price.unit_amount / 100
            : null,
        });

        await supabase.from('profiles').update({
          assinatura_ativa: true,
          assinatura_inicio: now.toISOString(),
          assinatura_fim: endDate,
        }).eq('id', userId);

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        if (!userId) break;

        const status = subscription.status === 'active' || subscription.status === 'trialing'
          ? 'ativa'
          : subscription.status === 'canceled' ? 'cancelada' : 'expirada';

        const endDate = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        await supabase.from('assinaturas')
          .update({ status, data_fim: endDate })
          .eq('stripe_id', subscription.id);

        await supabase.from('profiles').update({
          assinatura_ativa: status === 'ativa',
          assinatura_fim: endDate,
        }).eq('id', userId);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        if (!userId) break;

        await supabase.from('assinaturas')
          .update({ status: 'expirada', data_fim: new Date().toISOString() })
          .eq('stripe_id', subscription.id);

        await supabase.from('profiles').update({
          assinatura_ativa: false,
          assinatura_fim: new Date().toISOString(),
        }).eq('id', userId);

        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

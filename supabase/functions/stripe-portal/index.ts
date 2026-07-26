import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) return new Response('Unauthorized', { status: 401 });

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${authHeader}` } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) return new Response('Unauthorized', { status: 401 });

    const { data: assinatura } = await supabase
      .from('assinaturas')
      .select('stripe_id')
      .eq('user_id', user.id)
      .eq('status', 'ativa')
      .maybeSingle();

    if (!assinatura?.stripe_id) {
      return new Response(JSON.stringify({ error: 'No active subscription' }), { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://top-concurso.vercel.app';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.email || '',
      return_url: `${origin}/planos`,
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

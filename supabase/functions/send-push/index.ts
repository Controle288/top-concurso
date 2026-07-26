import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { WebPush } from 'https://esm.sh/@pagopa/openapi-webpush@0.0.33?target=deno';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') || '';
const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface NotificationPayload {
  user_id?: string;
  title: string;
  body: string;
  url?: string;
  user_ids?: string[];
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) return new Response('Unauthorized', { status: 401 });

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) return new Response('Unauthorized', { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') return new Response('Forbidden', { status: 403 });

    const payload: NotificationPayload = await req.json();
    if (!payload.title || !payload.body) return new Response('Missing title or body', { status: 400 });

    let query = supabase.from('push_subscriptions').select('user_id, subscription');
    if (payload.user_id) query = query.eq('user_id', payload.user_id);
    if (payload.user_ids) query = query.in('user_id', payload.user_ids);

    const { data: subscriptions } = await query;
    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { 'Content-Type': 'application/json' } });
    }

    const applicationServerKey = vapidPublicKey;
    const subject = 'mailto:contato@topconcurso.app';

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription: PushSubscription = JSON.parse(sub.subscription);
          await WebPush.sendNotification(
            pushSubscription,
            JSON.stringify({
              title: payload.title,
              body: payload.body,
              icon: '/icon.svg',
              data: { url: payload.url || '/' },
            }),
            { subject, publicKey: applicationServerKey, privateKey: vapidPrivateKey }
          );
          return { user_id: sub.user_id, success: true };
        } catch (err) {
          if (err instanceof Error && (err.message.includes('410') || err.message.includes('404'))) {
            await supabase.from('push_subscriptions').delete().eq('user_id', sub.user_id);
          }
          return { user_id: sub.user_id, success: false };
        }
      })
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;

    return new Response(JSON.stringify({ sent, total: subscriptions.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

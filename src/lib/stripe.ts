import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

let stripePromise: Promise<any> | null = null

export function getStripe() {
  if (!stripePromise && STRIPE_PK) {
    stripePromise = loadStripe(STRIPE_PK)
  }
  return stripePromise
}

interface CheckoutOptions {
  price_id: string
  trial_days?: number
}

export async function redirectToCheckout(priceId: string, options?: { trial_days?: number }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const { data: { session } } = await import('./supabase').then(m => m.supabase.auth.getSession())
  if (!session?.access_token) return

  const body: CheckoutOptions = { price_id: priceId }
  if (options?.trial_days) body.trial_days = options.trial_days

  const res = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  })

  const { url } = await res.json()
  if (url) window.location.href = url
}

export async function createPortalSession() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const { data: { session } } = await import('./supabase').then(m => m.supabase.auth.getSession())
  if (!session?.access_token) return

  const res = await fetch(`${supabaseUrl}/functions/v1/stripe-portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
  })

  const { url } = await res.json()
  if (url) window.location.href = url
}

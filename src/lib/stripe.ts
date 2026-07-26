import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

let stripePromise: Promise<Stripe | null> | null = null

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

interface EdgeFunctionResponse {
  url?: string
}

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export async function redirectToCheckout(priceId: string, options?: { trial_days?: number }) {
  const token = await getAccessToken()
  if (!token) return

  const body: CheckoutOptions = { price_id: priceId }
  if (options?.trial_days) body.trial_days = options.trial_days

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) return
    const data: EdgeFunctionResponse = await res.json()
    if (data.url) window.location.href = data.url
  } catch {
    // network error
  }
}

export async function createPortalSession() {
  const token = await getAccessToken()
  if (!token) return

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/stripe-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    if (!res.ok) return
    const data: EdgeFunctionResponse = await res.json()
    if (data.url) window.location.href = data.url
  } catch {
    // network error
  }
}

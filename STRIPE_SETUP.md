# Configuração do Stripe

## 1. Criar conta no Stripe
- Acesse https://dashboard.stripe.com/register
- Crie sua conta

## 2. Obter as chaves de API
- No dashboard do Stripe, vá em: Developers → API Keys
- Copie a **Publishable Key** (pk_test_...) e **Secret Key** (sk_test_...)

## 3. Adicionar no .env.local
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Criar produtos no Stripe
No dashboard do Stripe, vá em: Products → Add Product

Crie dois produtos:
- **Premium Mensal** - R$ 19,90/mês (preço padrão)
- **Premium Anual** - R$ 199,90/ano

Após criar, copie os **Price IDs** (ex: `price_123abc`) e atualize no arquivo:
`src/components/assinatura/Planos.tsx` — substitua os `priceId` nos planos.

## 5. Deploy das Edge Functions
```bash
npx supabase functions deploy stripe-checkout
npx supabase functions deploy stripe-webhook
npx supabase functions deploy stripe-portal
```

Defina os segredos:
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

## 6. Configurar Webhook no Stripe
- No dashboard do Stripe, vá em: Developers → Webhooks → Add endpoint
- URL: `https://[seu-projeto].supabase.co/functions/v1/stripe-webhook`
- Eventos para escutar:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Após criar, copie o **Signing Secret** (whsec_...) e defina como STRIPE_WEBHOOK_SECRET

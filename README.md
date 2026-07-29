# Top Concurso

Plataforma de estudos mobile-first para concursos públicos brasileiros. Videoaulas, questões comentadas, PDFs, cronogramas, flashcards, fórum, cursos livres e assinatura premium.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript 5.8 + Vite 6 |
| Roteamento | React Router DOM v7 |
| Estilização | Tailwind CSS v4 (tema escuro glassmorphism) |
| Data Fetching | TanStack React Query v5 |
| Backend/Banco | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Pagamentos | Stripe (Checkout, Portal, Webhooks) |
| Testes | Vitest + React Testing Library |
| PWA | Service Worker + Web Push |

## Pré-requisitos

- Node.js 18+
- Conta [Supabase](https://supabase.com) (gratuita)
- Chave [YouTube Data API v3](https://console.cloud.google.com/apis/credentials)
- [Stripe](https://stripe.com) (opcional, para assinaturas)

## Setup Local

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves reais

# 3. Aplicar migrations no Supabase
# Execute o conteúdo de supabase/migrations/008_squash_final.sql
# no SQL Editor do seu projeto Supabase

# 4. Rodar o seed (opcional)
npm run seed:tudo

# 5. Iniciar dev server
npm run dev
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento (porta 3000) |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Type checking (`tsc --noEmit`) |
| `npm test` | Executa testes (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npm run seed:tudo` | Popula banco com dados iniciais |

## Variáveis de Ambiente

| Variável | Obrigatório | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave anônima do Supabase |
| `VITE_YOUTUBE_API_KEY` | Sim | Chave da YouTube Data API v3 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Não | Chave pública do Stripe (pk_) |
| `VITE_VAPID_PUBLIC_KEY` | Não | Chave VAPID para push notifications |

## Estrutura do Projeto

```
src/
├── main.tsx                 # Entry point (React Query + Auth + SW)
├── App.tsx                  # Roteador principal com lazy loading
├── Login.tsx                # Página de login/registro
├── types.ts                 # Interfaces TypeScript
├── index.css                # Estilos globais + design system
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   ├── AuthContext.tsx       # Contexto de autenticação
│   ├── queries/             # Hooks React Query por domínio
│   ├── __tests__/           # Testes unitários
│   ├── stripe.ts            # Integração Stripe
│   ├── notifications.ts     # Push notifications
│   └── ...
├── components/
│   ├── layout/              # MobileFrame, DesktopSidebar, BottomNav
│   ├── shared/              # SearchBar, PremiumGate, AdminRoute, etc.
│   ├── dashboard/           # Página inicial
│   ├── questoes/            # Simulados e questões
│   ├── videos/              # Videoaulas
│   ├── pdfs/                # Biblioteca de PDFs
│   ├── cursos/              # Cursos livres
│   ├── cronograma/          # Plano de estudos
│   ├── forum/               # Fórum de discussão
│   ├── tickets/             # Suporte
│   ├── perfil/              # Perfil do usuário
│   ├── revisao/             # Flashcards (revisão espaçada)
│   ├── resumos/             # Resumos do usuário
│   └── assinatura/          # Planos premium
└── pages/admin/             # Painel administrativo
```

## Migrations (Supabase)

O histórico de migrações está em `supabase/migrations/`:

| Migration | Descrição |
|---|---|
| `001` a `006` | Migrações incrementais (histórico) |
| `007` | Tarefas diárias + respostas de questões |
| `008` | **Squash final** — schema completo para novos setups |

Para **novos projetos**: execute apenas o `008_squash_final.sql`.
Para **upgrades**: execute em ordem de `001` a `007`.

## Funcionalidades

- Autenticação por email/senha (Supabase Auth)
- Dashboard com metas, streak e progresso
- Simulados com filtros (banca, disciplina, ano, nível)
- Modo prova com timer cronometrado
- Videoaulas do YouTube organizadas por concurso
- Biblioteca de PDFs (PDF, Áudio, Resumo, Lei Seca)
- Cursos livres com módulos e progresso
- Cronograma de estudos personalizado
- Revisão espaçada (flashcards estilo Leitner)
- Fórum de discussão
- Sistema de tickets de suporte
- Assinatura premium com Stripe
- Notificações push
- Painel admin completo (CRUD)

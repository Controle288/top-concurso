import { execSync } from 'child_process'

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const env = { ...process.env, SUPABASE_SERVICE_ROLE_KEY: supabaseKey }

async function main() {
  const start = Date.now()
  console.log('========================================')
  console.log('  TOP CONCURSO - Seed Completo')
  console.log('========================================\n')

  console.log('⚠️  Execute os SQLs manualmente no Supabase SQL Editor:')
  console.log('   1. https://supabase.com/dashboard/project/fpwxsjvtasyfyoczsflu/sql/new')
  console.log('   2. Cole supabase/seed.sql e execute')
  console.log('   3. Cole supabase/seed_complementar.sql e execute\n')

  console.log('=== Gerando questões extras ===')
  execSync('npx tsx --env-file=.env.local supabase/seed-questoes.ts', { stdio: 'inherit', env })
  console.log()

  console.log('=== Buscando aulas do YouTube ===')
  execSync('npx tsx --env-file=.env.local supabase/seed-aulas.ts', { stdio: 'inherit', env })
  console.log()

  const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1)
  console.log(`\n✅ Seed completo em ${elapsed} minutos!`)
}

main().catch(err => { console.error('Erro fatal:', err); process.exit(1) })

#!/bin/bash

echo "🚀 Migrando Backend para Supabase Edge Functions"
echo "==============================================="

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "📦 Instalando Supabase CLI..."
    curl -fsSL https://supabase.com/install.sh | sh
    echo "✅ Supabase CLI instalado!"
else
    echo "✅ Supabase CLI já está instalado"
fi

# Verificar se o Deno está instalado
if ! command -v deno &> /dev/null; then
    echo "📦 Instalando Deno..."
    curl -fsSL https://deno.land/install.sh | sh
    echo "✅ Deno instalado!"
else
    echo "✅ Deno já está instalado"
fi

echo ""
echo "🔧 Configurando projeto Supabase..."
echo ""

# Fazer login no Supabase
echo "🔐 Fazendo login no Supabase..."
supabase login

# Inicializar projeto Supabase
echo "📁 Inicializando estrutura do Supabase..."
supabase init

# Criar estrutura de Edge Functions
echo "🏗️  Criando estrutura de Edge Functions..."
mkdir -p supabase/functions/{auth,management,quiz,admin,ranking}/_shared

# Criar arquivo de configuração compartilhada
echo "📝 Criando arquivos de configuração..."
cat > supabase/functions/_shared/cors.ts << 'EOF'
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}
EOF

cat > supabase/functions/_shared/database.ts << 'EOF'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  return createClient(supabaseUrl, supabaseKey)
}
EOF

cat > supabase/functions/_shared/auth.ts << 'EOF'
import { getSupabaseClient } from './database.ts'

export const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader) {
    return { error: 'Unauthorized', user: null }
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = getSupabaseClient()
  
  const { data: user, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return { error: 'Invalid token', user: null }
  }

  return { error: null, user: user.user }
}
EOF

# Criar Edge Function para autenticação
echo "🔐 Criando Edge Function de autenticação..."
cat > supabase/functions/auth/index.ts << 'EOF'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getSupabaseClient } from '../_shared/database.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = getSupabaseClient()
  
  try {
    const { email, password } = await req.json()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        token: data.session?.access_token,
        user: data.user 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
EOF

# Criar Edge Function para gerenciamento
echo "⚙️  Criando Edge Function de gerenciamento..."
cat > supabase/functions/management/index.ts << 'EOF'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getSupabaseClient } from '../_shared/database.ts'
import { verifyAuth } from '../_shared/auth.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = getSupabaseClient()
  const url = new URL(req.url)
  const path = url.pathname
  
  const authHeader = req.headers.get('Authorization')
  const { error: authError, user } = await verifyAuth(authHeader)
  
  if (authError) {
    return new Response(
      JSON.stringify({ error: authError }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Roteamento para usuários
    if (path.includes('/users') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('users')
        .select('*')
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Roteamento para turmas
    if (path.includes('/classes') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Roteamento para atividades
    if (path.includes('/atividades') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('atividades')
        .select('*')
        .order('ordem', { ascending: true })
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
EOF

echo ""
echo "🎯 Próximos passos:"
echo "1. Configure seu projeto Supabase no painel web"
echo "2. Execute: supabase link --project-ref SEU_PROJECT_ID"
echo "3. Configure os secrets: supabase secrets set SUPABASE_URL=... "
echo "4. Execute: supabase functions deploy"
echo "5. Atualize a URL da API no frontend"
echo ""
echo "📖 Consulte o guia completo: SUPABASE_EDGE_FUNCTIONS_GUIDE.md"
echo ""
echo "✨ Vantagens desta migração:"
echo "  - Custo zero para Edge Functions"
echo "  - Integração total com banco Supabase"
echo "  - Escalabilidade automática"
echo "  - Latência ultra baixa"
echo "  - Monitoramento integrado"
echo ""
echo "🎉 Migração preparada com sucesso!" 
# 🚀 Deploy com Supabase Edge Functions

## 📋 Pré-requisitos

- Projeto Supabase criado
- Supabase CLI instalado
- Deno instalado (runtime para Edge Functions)

## 🔧 Instalação do Supabase CLI

```bash
# Linux/macOS
curl -fsSL https://supabase.com/install.sh | sh

# Windows
scoop install supabase

# Verificar instalação
supabase --version
```

## 🛠️ Configuração do Projeto

### 1. Inicializar Supabase no projeto

```bash
cd /home/mago/Área\ de\ trabalho/projetointegrador/Projeto-P.I

# Fazer login no Supabase
supabase login

# Vincular ao projeto existente
supabase link --project-ref SEU_PROJECT_ID

# Ou criar nova estrutura
supabase init
```

### 2. Estrutura de Edge Functions

```
supabase/
├── functions/
│   ├── admin/
│   │   └── index.ts
│   ├── auth/
│   │   └── index.ts
│   ├── management/
│   │   └── index.ts
│   ├── quiz/
│   │   └── index.ts
│   └── _shared/
│       ├── cors.ts
│       ├── database.ts
│       └── auth.ts
└── config.toml
```

## 📝 Migração do Backend

### 1. Estrutura Principal das Edge Functions

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// supabase/functions/_shared/database.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  return createClient(supabaseUrl, supabaseKey)
}
```

### 2. Exemplo de Edge Function para Autenticação

```typescript
// supabase/functions/auth/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getSupabaseClient } from '../_shared/database.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = getSupabaseClient()
  
  try {
    const { email, password } = await req.json()
    
    // Autenticação com Supabase Auth
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
```

### 3. Edge Function para Gerenciamento

```typescript
// supabase/functions/management/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getSupabaseClient } from '../_shared/database.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = getSupabaseClient()
  const url = new URL(req.url)
  const path = url.pathname
  
  // Verificar autenticação
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: user } = await supabase.auth.getUser(token)
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Roteamento baseado no path
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

    // Adicionar mais rotas aqui...
    
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
```

## 🔑 Configuração de Variáveis de Ambiente

```bash
# Definir secrets para Edge Functions
supabase secrets set SUPABASE_URL=https://sua-url.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
supabase secrets set JWT_SECRET=sua-chave-jwt-secreta
```

## 🚀 Deploy das Edge Functions

```bash
# Deploy individual
supabase functions deploy auth
supabase functions deploy management
supabase functions deploy quiz

# Deploy todas as funções
supabase functions deploy
```

## 🌐 URLs das Edge Functions

Após o deploy, suas funções estarão disponíveis em:

- `https://SEU_PROJECT_ID.supabase.co/functions/v1/auth`
- `https://SEU_PROJECT_ID.supabase.co/functions/v1/management`
- `https://SEU_PROJECT_ID.supabase.co/functions/v1/quiz`

## 🔧 Atualização do Frontend

Atualize o arquivo `frontend/src/services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://SEU_PROJECT_ID.supabase.co/functions/v1',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

## 📊 Monitoramento e Logs

```bash
# Ver logs das funções
supabase functions logs auth
supabase functions logs management

# Logs em tempo real
supabase functions logs --follow
```

## 🎯 Vantagens desta Abordagem

### ✅ Benefícios:
- **Custo Zero** para Edge Functions (até 500k requests/mês)
- **Integração Total** com Supabase Auth e Database
- **Escalabilidade Automática**
- **Latência Baixa** (Edge Computing)
- **Desenvolvimento Simplificado**
- **Monitoramento Integrado**

### 🔄 Comparação com Outras Opções:

| Aspecto | Supabase Edge Functions | Railway/Render | Vercel Functions |
|---------|-------------------------|----------------|------------------|
| **Custo** | Gratuito até 500k req | $5-20/mês | $20/mês |
| **Integração DB** | Nativa | Requer config | Requer config |
| **Latência** | Muito baixa | Baixa | Muito baixa |
| **Escalabilidade** | Automática | Manual | Automática |
| **Complexidade** | Baixa | Média | Média |

## 📋 Passos para Migração

1. **Instalar Supabase CLI**
2. **Criar estrutura de Edge Functions**
3. **Migrar rotas do Express para Edge Functions**
4. **Configurar variáveis de ambiente**
5. **Fazer deploy das funções**
6. **Atualizar frontend para usar novas URLs**
7. **Testar todas as funcionalidades**

## 🛠️ Script de Migração

```bash
#!/bin/bash
# migrate-to-edge-functions.sh

echo "🚀 Migrando para Supabase Edge Functions"

# Instalar Supabase CLI
curl -fsSL https://supabase.com/install.sh | sh

# Fazer login
supabase login

# Vincular projeto
supabase link --project-ref $PROJECT_ID

# Criar estrutura de funções
mkdir -p supabase/functions/{auth,management,quiz,admin}/_shared

# Deploy
supabase functions deploy

echo "✅ Migração concluída!"
```

## 🆘 Resolução de Problemas

### Erro de CORS
```typescript
// Adicionar headers CORS em todas as responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### Erro de Autenticação
```typescript
// Verificar token do Supabase Auth
const { data: user } = await supabase.auth.getUser(token)
```

### Timeout de Função
```typescript
// Edge Functions têm timeout de 60 segundos
// Otimizar consultas do banco de dados
```

---

**Esta abordagem é mais econômica, integrada e escalável do que usar serviços separados!** 🎉 
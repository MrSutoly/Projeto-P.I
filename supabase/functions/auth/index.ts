import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getSupabaseClient } from '../_shared/database.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = getSupabaseClient()
  const url = new URL(req.url)
  const path = url.pathname
  
  try {
    // Login endpoint
    if (path.includes('/login') && req.method === 'POST') {
      const { email, password } = await req.json()
      
      // Buscar usuário no banco custom
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (userError || !users) {
        return new Response(
          JSON.stringify({ error: 'Usuário não encontrado' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Verificar senha (você precisará implementar bcrypt para Deno)
      // Por enquanto, comparação simples
      if (users.password !== password) {
        return new Response(
          JSON.stringify({ error: 'Senha incorreta' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Gerar token JWT simples (em produção, use uma biblioteca JWT)
      const token = btoa(JSON.stringify({
        id: users.id,
        email: users.email,
        role: users.role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      }))

      return new Response(
        JSON.stringify({ 
          token,
          user: {
            id: users.id,
            nome: users.nome,
            email: users.email,
            role: users.role
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { 
        status: 404, 
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

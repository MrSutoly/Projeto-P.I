import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { getSupabaseClient } from '../_shared/database.ts'

const verifyToken = (authHeader: string | null) => {
  if (!authHeader) return null
  
  try {
    const token = authHeader.replace('Bearer ', '')
    const decoded = JSON.parse(atob(token))
    
    // Verificar se token não expirou
    if (decoded.exp < Date.now()) return null
    
    return decoded
  } catch {
    return null
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = getSupabaseClient()
  const url = new URL(req.url)
  const path = url.pathname
  
  // Verificar autenticação
  const authHeader = req.headers.get('Authorization')
  const user = verifyToken(authHeader)
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // GET /users - Listar usuários
    if (path.includes('/users') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome, email, role, turma_id, created_at')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /users - Criar usuário
    if (path.includes('/users') && req.method === 'POST') {
      const userData = await req.json()
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          nome: userData.nome,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'aluno',
          turma_id: userData.turma_id
        }])
        .select()
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data[0]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT /users/:id - Atualizar usuário
    if (path.includes('/users/') && req.method === 'PUT') {
      const userId = path.split('/users/')[1].split('/')[0]
      const userData = await req.json()
      
      const updateData: any = {
        nome: userData.nome,
        email: userData.email,
        role: userData.role,
        turma_id: userData.turma_id
      }
      
      // Só atualizar senha se fornecida
      if (userData.password) {
        updateData.password = userData.password
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data[0]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // DELETE /users/:id - Deletar usuário
    if (path.includes('/users/') && req.method === 'DELETE') {
      const userId = path.split('/users/')[1].split('/')[0]
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
      
      if (error) throw error
      
      return new Response(
        JSON.stringify({ message: 'Usuário deletado com sucesso' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /classes - Listar turmas
    if (path.includes('/classes') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('nome', { ascending: true })
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /classes - Criar turma
    if (path.includes('/classes') && req.method === 'POST') {
      const classData = await req.json()
      
      const { data, error } = await supabase
        .from('classes')
        .insert([{
          nome: classData.nome,
          codigo: classData.codigo,
          professor_id: user.role === 'professor' ? user.id : null
        }])
        .select()
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data[0]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /atividades - Listar atividades
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

    // POST /atividades - Criar atividade
    if (path.includes('/atividades') && req.method === 'POST') {
      const atividadeData = await req.json()
      
      const { data, error } = await supabase
        .from('atividades')
        .insert([{
          titulo: atividadeData.titulo,
          descricao: atividadeData.descricao,
          tipo: atividadeData.tipo,
          ordem: atividadeData.ordem,
          data: atividadeData.data,
          horario: atividadeData.horario,
          pontos: atividadeData.pontos,
          status: 'bloqueada'
        }])
        .select()
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data[0]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /ranking - Ranking de usuários
    if (path.includes('/ranking') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome, pontos_totais')
        .not('pontos_totais', 'is', null)
        .order('pontos_totais', { ascending: false })
        .limit(10)
      
      if (error) throw error
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Route not found', path }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

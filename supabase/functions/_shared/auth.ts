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
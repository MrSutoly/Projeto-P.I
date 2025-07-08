import axios from 'axios';

// Configuração para Supabase Edge Functions
const api = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL 
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
    : 'https://SEU_PROJECT_ID.supabase.co/functions/v1',
});

// Interceptador para adicionar token de autenticação
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Adicionar API key do Supabase se disponível
  const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (apiKey) {
    config.headers.apikey = apiKey;
  }
  
  return config;
});

// Interceptador para tratamento de respostas
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Exemplo de uso das rotas:
// POST /auth - Login
// GET /management/users - Listar usuários
// GET /management/classes - Listar turmas
// GET /management/atividades - Listar atividades
// GET /quiz/... - Operações de quiz
// GET /ranking - Ranking de usuários 
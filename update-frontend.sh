#!/bin/bash

echo "🌐 Atualizando Frontend para Supabase Edge Functions"
echo "===================================================="
echo ""

# Verificar se temos o Project ID
if [ -f ".supabase/config.toml" ]; then
    PROJECT_REF=$(grep 'project_id' .supabase/config.toml | cut -d'"' -f2)
    echo "✅ Project ID encontrado: $PROJECT_REF"
else
    read -p "Digite o Project Reference ID do Supabase: " PROJECT_REF
fi

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project ID é obrigatório!"
    exit 1
fi

echo ""
echo "🔧 Atualizando configuração da API..."

# Backup do arquivo original
cp frontend/src/services/api.ts frontend/src/services/api-backup.ts
echo "💾 Backup criado: api-backup.ts"

# Atualizar api.ts para usar Supabase Edge Functions
cat > frontend/src/services/api.ts << EOF
import axios from 'axios';

// Configuração para Supabase Edge Functions
const api = axios.create({
  baseURL: 'https://$PROJECT_REF.supabase.co/functions/v1',
});

// Interceptador para adicionar token de autenticação
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
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
EOF

echo "✅ API atualizada para: https://$PROJECT_REF.supabase.co/functions/v1"

echo ""
echo "🔄 Atualizando rotas do frontend..."

# Atualizar rotas específicas que usam fetch direto
echo "📝 Atualizando rotas em páginas específicas..."

# Lista de arquivos que podem ter URLs hardcoded
files_to_update=(
    "frontend/src/Pages/CadastroAlunos/index_cadastro_alunos.tsx"
    "frontend/src/Pages/CadastroProfessores/index_cadastro_professores.tsx"
    "frontend/src/Pages/CadastroTurmas/index_cadastro_turmas.tsx"
    "frontend/src/Pages/GerenciarAtividades/index_gerenciar_atividades.tsx"
    "frontend/src/Components/Conteudo_Percurso/Conteudo_Percurso.tsx"
    "frontend/src/Pages/Login/index_login.tsx"
)

for file in "${files_to_update[@]}"; do
    if [ -f "$file" ]; then
        echo "🔧 Atualizando $file..."
        # Substituir URLs localhost pelas URLs do Supabase
        sed -i "s|http://localhost:3333/api|https://$PROJECT_REF.supabase.co/functions/v1|g" "$file"
        echo "✅ $file atualizado"
    fi
done

echo ""
echo "🧪 Testando build do frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build do frontend: SUCESSO"
    cd ..
else
    echo "❌ Build do frontend: ERRO"
    echo "🔄 Restaurando backup..."
    cp frontend/src/services/api-backup.ts frontend/src/services/api.ts
    cd ..
    exit 1
fi

echo ""
echo "📋 URLs finais do sistema:"
echo "- Frontend: https://seu-projeto.vercel.app"
echo "- Backend Auth: https://$PROJECT_REF.supabase.co/functions/v1/auth"
echo "- Backend Management: https://$PROJECT_REF.supabase.co/functions/v1/management"
echo "- Backend Ranking: https://$PROJECT_REF.supabase.co/functions/v1/ranking"
echo "- Dashboard Supabase: https://supabase.com/dashboard/project/$PROJECT_REF"

echo ""
echo "🎉 Frontend atualizado com sucesso!"
echo "🚀 Pronto para deploy no Vercel!"

echo ""
echo "📋 Próximos passos:"
echo "1. ✅ Backend deployado (Edge Functions)"
echo "2. ✅ Frontend atualizado"
echo "3. 🔧 Configurar banco de dados no Supabase"
echo "4. 🚀 Deploy frontend no Vercel"
echo "5. 🧪 Testar sistema completo" 
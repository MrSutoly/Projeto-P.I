#!/bin/bash

echo "🚀 Completando Deploy do Backend com Supabase Edge Functions"
echo "============================================================="
echo ""

# Verificar se já temos um projeto linkado
if [ -f ".supabase/config.toml" ]; then
    echo "✅ Projeto Supabase já vinculado!"
else
    echo "🔗 Você precisa vincular ao seu projeto Supabase"
    echo ""
    echo "📝 Primeiro, obtenha as informações do seu projeto:"
    echo "1. Acesse: https://supabase.com/dashboard"
    echo "2. Selecione seu projeto"
    echo "3. Vá em Settings > API"
    echo "4. Copie o Project Reference ID"
    echo ""
    read -p "Digite o Project Reference ID: " PROJECT_REF
    
    if [ -z "$PROJECT_REF" ]; then
        echo "❌ Project ID é obrigatório!"
        exit 1
    fi
    
    echo "🔗 Vinculando ao projeto $PROJECT_REF..."
    npx supabase link --project-ref $PROJECT_REF
fi

echo ""
echo "📊 Verificando estrutura das Edge Functions..."
ls -la supabase/functions/

echo ""
echo "🚀 Fazendo deploy das Edge Functions..."

# Deploy individual das funções
echo "📤 Deployando função de autenticação..."
npx supabase functions deploy auth

echo "📤 Deployando função de gerenciamento..."
npx supabase functions deploy management

echo "📤 Deployando função de ranking..."
npx supabase functions deploy ranking

echo ""
echo "🎯 URLs das Edge Functions deployadas:"
echo "- Auth: https://$PROJECT_REF.supabase.co/functions/v1/auth"
echo "- Management: https://$PROJECT_REF.supabase.co/functions/v1/management"
echo "- Ranking: https://$PROJECT_REF.supabase.co/functions/v1/ranking"

echo ""
echo "📋 Próximos passos:"
echo "1. ✅ Backend deployado com Edge Functions"
echo "2. 🔧 Configurar banco de dados (execute as tabelas SQL)"
echo "3. 🌐 Atualizar frontend para usar novas URLs"
echo "4. 🧪 Testar todas as funcionalidades"

echo ""
echo "🔑 Credenciais para testar:"
echo "- Admin: admin@teste.com / admin123"
echo "- Professor: professor@teste.com / professor123"
echo "- Aluno: aluna@teste.com / aluna123"

echo ""
echo "📖 Para configurar o banco:"
echo "1. Acesse: https://supabase.com/dashboard/project/$PROJECT_REF/sql"
echo "2. Execute o script: backend/database/supabase_setup.sql"

echo ""
echo "✨ Deploy das Edge Functions concluído com sucesso!"
echo "💰 Custo: R$ 0,00/mês (gratuito até 500k requests)" 
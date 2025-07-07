#!/bin/bash

echo "🚀 Iniciando deploy do Projeto Doutores Ambientais Mirins"
echo "==============================================="

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Há mudanças não commitadas. Fazendo commit..."
    git add .
    git commit -m "feat: Preparação para deploy no Vercel"
fi

# Push para o repositório
echo "📤 Sincronizando com o repositório..."
git push origin main

# Teste de build do frontend
echo "🔨 Testando build do frontend..."
cd frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build do frontend: SUCESSO"
    cd ..
else
    echo "❌ Build do frontend: FALHOU"
    cd ..
    exit 1
fi

# Teste de build do backend
echo "🔨 Testando build do backend..."
cd backend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build do backend: SUCESSO"
    cd ..
else
    echo "❌ Build do backend: FALHOU"
    cd ..
    exit 1
fi

echo ""
echo "🎉 PROJETO PRONTO PARA DEPLOY!"
echo "==============================================="
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse: https://vercel.com/dashboard"
echo "2. Clique em 'New Project'"
echo "3. Importe este repositório do GitHub"
echo "4. Configure as variáveis de ambiente:"
echo "   - VITE_API_URL=https://sua-api-backend.com/api"
echo "5. Deploy do backend em Railway/Render/Heroku"
echo ""
echo "📖 Guia completo: DEPLOY_GUIDE.md"
echo ""
echo "🔑 Credenciais de teste:"
echo "- Admin: admin@teste.com / admin123"
echo "- Professor: professor@teste.com / professor123"
echo "- Aluno: aluna@teste.com / aluna123"
echo ""
echo "🌐 URLs após deploy:"
echo "- Frontend: https://seu-projeto.vercel.app"
echo "- Backend: https://sua-api.herokuapp.com"
echo ""
echo "✨ Deploy concluído com sucesso!" 
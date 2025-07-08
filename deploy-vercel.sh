#!/bin/bash

echo "🚀 Deploy no Vercel - Doutores Ambientais Mirins"
echo "==============================================="
echo ""

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI instalado!"
else
    echo "✅ Vercel CLI já está instalado"
fi

echo ""
echo "🔧 Verificando build do frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build do frontend: SUCESSO"
else
    echo "❌ Build do frontend: FALHOU"
    exit 1
fi

cd ..

echo ""
echo "📤 Fazendo deploy no Vercel..."
echo ""

# Fazer login no Vercel (se necessário)
echo "🔐 Verificando login no Vercel..."
vercel whoami || vercel login

echo ""
echo "🚀 Iniciando deploy..."

# Deploy com configurações específicas
vercel --prod \
  --build-env VITE_API_URL="$1" \
  --name "projeto-doutores-ambientais" \
  --scope doutores-ambientais

echo ""
echo "🎉 Deploy concluído!"
echo ""
echo "📋 URLs do sistema:"
echo "- Frontend: https://projeto-doutores-ambientais.vercel.app"
echo "- Backend: $1"
echo ""
echo "🔑 Credenciais para testar:"
echo "- Admin: admin@teste.com / admin123"
echo "- Professor: professor@teste.com / professor123"
echo "- Aluno: aluna@teste.com / aluna123"
echo ""
echo "✨ Sistema completo deployado com sucesso!" 
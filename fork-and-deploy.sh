#!/bin/bash

echo "🍴 Fork e Deploy - Doutores Ambientais Mirins"
echo "=============================================="
echo ""

# Verificar se foi passado o username
if [ -z "$1" ]; then
    echo "❌ Erro: Você precisa informar seu username do GitHub"
    echo ""
    echo "Uso: ./fork-and-deploy.sh SEU_USERNAME_GITHUB"
    echo ""
    echo "Exemplo: ./fork-and-deploy.sh joaosilva"
    exit 1
fi

USERNAME=$1
echo "👤 Username GitHub: $USERNAME"
echo ""

# Verificar se já foi feito o fork
echo "🔍 PASSO 1: Fazer Fork do Repositório"
echo "1. Acesse: https://github.com/MrSutoly/Projeto-P.I"
echo "2. Clique em 'Fork' (canto superior direito)"
echo "3. Aguarde a cópia ser criada na sua conta"
echo ""
read -p "✅ Fork criado? (pressione ENTER para continuar)"

echo ""
echo "🔄 PASSO 2: Atualizando Remote Local..."
git remote set-url origin https://github.com/$USERNAME/Projeto-P.I.git

echo "📤 PASSO 3: Enviando para seu repositório..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Repositório atualizado com sucesso!"
else
    echo "❌ Erro ao enviar para seu repositório"
    echo "Verifique se o fork foi criado corretamente"
    exit 1
fi

echo ""
echo "🚀 PASSO 4: Deploy no Vercel"
echo "Agora você pode fazer deploy normalmente:"
echo ""
echo "1. Acesse: https://vercel.com"
echo "2. Login com GitHub"
echo "3. Clique em 'Add New...' → 'Project'"
echo "4. Importe: $USERNAME/Projeto-P.I"
echo "5. Configure:"
echo "   - Root Directory: frontend"
echo "   - Framework: Vite"
echo "   - Environment Variable: VITE_API_URL=https://PROJECT_ID.supabase.co/functions/v1"
echo ""
echo "🌐 Seu repositório: https://github.com/$USERNAME/Projeto-P.I"
echo ""
echo "🎉 Pronto! Agora o projeto está na sua conta e você pode fazer deploy!" 
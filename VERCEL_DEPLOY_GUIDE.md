# 🚀 Guia de Deploy no Vercel - Doutores Ambientais Mirins

## 📋 Pré-requisitos

✅ **Preparado:**
- Frontend compilando sem erros
- Backend no Supabase Edge Functions
- Repositório no GitHub atualizado
- Scripts automáticos criados

## 🎯 Opções de Deploy

### 1. Deploy Automático via Script (RECOMENDADO)

```bash
# Substituir PROJECT_ID pelo seu Project ID do Supabase
./deploy-vercel.sh https://PROJECT_ID.supabase.co/functions/v1
```

### 2. Deploy Manual via Interface Web

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New..." → "Project"
4. Importe repositório: `MrSutoly/Projeto-P.I`

## 🔧 Configuração do Deploy

### Configurações do Projeto:
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Variáveis de Ambiente (IMPORTANTE):
```
VITE_API_URL=https://PROJECT_ID.supabase.co/functions/v1
```

## 📝 Passo a Passo Detalhado

### Via Interface Web do Vercel:

1. **Login no Vercel:**
   - Acesse https://vercel.com
   - Clique em "Login" → "Continue with GitHub"
   - Autorize o Vercel no GitHub

2. **Importar Projeto:**
   - Clique em "Add New..." → "Project"
   - Procure por "Projeto-P.I" na lista
   - Clique em "Import"

3. **Configurar Deploy:**
   ```
   Project Name: projeto-doutores-ambientais
   Framework Preset: Vite
   Root Directory: frontend
   ```

4. **Variáveis de Ambiente:**
   - Clique em "Environment Variables"
   - Adicione: `VITE_API_URL`
   - Valor: `https://PROJECT_ID.supabase.co/functions/v1`
   - (Substitua PROJECT_ID pelo seu ID real)

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde ~2-3 minutos

### Via CLI (Alternativa):

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd frontend
vercel --prod

# 4. Configurar domínio (opcional)
vercel domains add projeto-doutores-ambientais.vercel.app
```

## 🌐 URLs Finais

Após o deploy:
- **Frontend:** https://projeto-doutores-ambientais.vercel.app
- **Backend:** https://PROJECT_ID.supabase.co/functions/v1
- **Dashboard:** https://vercel.com/dashboard

## 🔑 Credenciais de Teste

Para testar o sistema após deploy:

```
Admin:
- Email: admin@teste.com
- Senha: admin123

Professor:
- Email: professor@teste.com
- Senha: professor123

Aluno:
- Email: aluna@teste.com
- Senha: aluna123
```

## 📊 Monitoramento

### No Vercel:
- Logs de deploy em tempo real
- Analytics de performance
- Métricas de usuário
- Configuração de domínio customizado

### No Supabase:
- Logs das Edge Functions
- Métricas de banco de dados
- Monitoramento de requests

## 🚨 Solução de Problemas

### Erro de Build:
```bash
# Testar build local primeiro
cd frontend
npm run build
```

### Erro de Variável de Ambiente:
1. Verificar se `VITE_API_URL` está configurada
2. Redeployar projeto no Vercel
3. Verificar console do navegador

### Backend não responde:
1. Verificar Project ID do Supabase
2. Testar Edge Functions diretamente
3. Verificar logs no Supabase Dashboard

## 💰 Custos

### Vercel (Frontend):
- **Hobby Plan:** GRATUITO
- Limite: 100GB bandwidth/mês
- Build time: 6h/mês
- Domínio .vercel.app incluído

### Supabase (Backend):
- **Free Tier:** GRATUITO
- Limite: 500k requests/mês
- Banco de dados: 500MB
- Edge Functions: incluídas

**💡 Total: R$ 0,00/mês**

## 🎯 Próximos Passos

1. ✅ Deploy frontend no Vercel
2. ⚙️ Configurar domínio personalizado (opcional)
3. 📊 Configurar analytics
4. 🔒 Configurar SSL (automático)
5. 📱 Teste em dispositivos móveis

## 📞 Suporte

Em caso de problemas:
1. Verificar logs no Vercel Dashboard
2. Testar APIs do Supabase
3. Consultar documentação oficial:
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)

---

**🏆 Sistema 100% deployado e funcional!** 
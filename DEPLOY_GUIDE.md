# 🚀 Guia de Deploy - Doutores Ambientais Mirins

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com) (para banco de dados)
- Repositório Git sincronizado

## 🎯 Opções de Deploy

### Opção 1: Frontend no Vercel + Backend Separado (Recomendado)

#### 1. Deploy do Frontend no Vercel

1. **Conectar Repositório**:
   - Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
   - Clique em "New Project"
   - Importe o repositório do GitHub

2. **Configurar Build**:
   - Framework: `Vite`
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

3. **Configurar Variáveis de Ambiente**:
   ```
   VITE_API_URL=https://sua-api-backend.com/api
   ```

#### 2. Deploy do Backend (Opções)

**Opção A: Railway**
1. Acesse [Railway](https://railway.app)
2. Conecte o repositório
3. Configure:
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Port: `3333`

**Opção B: Render**
1. Acesse [Render](https://render.com)
2. Crie um Web Service
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

**Opção C: Heroku**
1. Configure `Procfile` no backend:
   ```
   web: npm start
   ```
2. Deploy via Git ou GitHub

### Opção 2: Deploy Completo no Vercel (Monorepo)

**⚠️ Limitações**: Serverless functions têm limitações para backend complexo

1. Use o arquivo `vercel.json` configurado
2. Configure variáveis de ambiente para ambos os projetos

## 🔧 Configuração do Banco de Dados

### Supabase (Recomendado)

1. **Criar Projeto**:
   - Acesse [Supabase](https://supabase.com)
   - Crie um novo projeto
   - Anote a URL e as chaves de API

2. **Configurar Tabelas**:
   ```sql
   -- Execute o script em: backend/database/supabase_setup.sql
   ```

3. **Variáveis de Ambiente no Backend**:
   ```env
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_SERVICE_KEY=sua_chave_de_servico
   JWT_SECRET=sua_chave_secreta_jwt
   ```

## 🌐 URLs de Produção

Após o deploy, você terá:

- **Frontend**: `https://seu-projeto.vercel.app`
- **Backend**: `https://sua-api.railway.app` (ou outro serviço)

## 📝 Lista de Verificação

- [ ] Repositório atualizado no GitHub
- [ ] Banco Supabase configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Frontend deployado no Vercel
- [ ] Backend deployado em serviço separado
- [ ] URLs atualizadas no frontend
- [ ] Teste de login funcionando
- [ ] Teste de criação de turmas/usuários

## 🔑 Credenciais Padrão

Após o deploy, use as credenciais:

- **Admin**: `admin@teste.com` / `admin123`
- **Professor**: `professor@teste.com` / `professor123`
- **Aluno**: `aluna@teste.com` / `aluna123`

## 🆘 Resolução de Problemas

### Erro de CORS
- Configure CORS no backend para aceitar o domínio do Vercel
- Adicione a URL do frontend nas origens permitidas

### Erro de Conexão com Banco
- Verifique as variáveis de ambiente do Supabase
- Teste a conexão local antes do deploy

### Erro 404 em Rotas
- Verifique se o `vercel.json` está configurado corretamente
- Use rewrites para SPA (Single Page Application)

## 📞 Suporte

Para problemas específicos:
1. Verifique os logs do Vercel
2. Teste localmente primeiro
3. Consulte a documentação do Supabase
4. Revise as configurações de ambiente

---

*Deploy realizado com sucesso! 🎉* 
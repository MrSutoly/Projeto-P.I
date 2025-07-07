# Configuração do Supabase

Este documento contém as instruções para migrar o projeto do MySQL para o Supabase.

## 1. Criar conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

## 2. Configurar o banco de dados

1. No painel do Supabase, vá para **SQL Editor**
2. Execute o script `database/supabase_setup.sql` para criar todas as tabelas
3. Verifique se as tabelas foram criadas em **Table Editor**

## 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:

```env
# Configurações do servidor
PORT=3333

# Configurações do Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_KEY=sua_chave_de_servico_do_supabase

# Configurações JWT
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=24h
```

### Como obter as chaves do Supabase:

1. No painel do Supabase, vá para **Settings** > **API**
2. Copie a **URL** e a **anon public key**
3. Para a **service key**, use a **service_role key** (mantenha segura)

## 4. Configurar Row Level Security (RLS)

O script SQL já inclui as políticas básicas de RLS. Você pode ajustá-las conforme necessário:

1. Vá para **Authentication** > **Policies**
2. Revise e ajuste as políticas conforme suas necessidades

## 5. Testar a conexão

Execute o projeto e verifique se a conexão está funcionando:

```bash
npm run dev
```

## 6. Migração de dados (se necessário)

Se você já tem dados no MySQL, pode exportá-los e importá-los no Supabase:

1. Exporte os dados do MySQL
2. Use o **SQL Editor** do Supabase para inserir os dados
3. Ou use a funcionalidade de importação do Supabase

## 7. Configurações adicionais

### Storage (para upload de arquivos)

Se precisar de upload de arquivos:

1. Vá para **Storage** no painel do Supabase
2. Crie buckets conforme necessário
3. Configure as políticas de acesso

### Authentication

Se quiser usar a autenticação do Supabase:

1. Vá para **Authentication** > **Settings**
2. Configure os provedores de autenticação
3. Ajuste as configurações de email

## 8. Troubleshooting

### Erro de conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se a URL e as chaves do Supabase estão corretas

### Erro de permissão
- Verifique as políticas RLS
- Confirme se as tabelas foram criadas corretamente

### Erro de tipo de dados
- Verifique se os tipos de dados no código correspondem aos do Supabase
- O Supabase usa PostgreSQL, que tem alguns tipos diferentes do MySQL

## 9. Diferenças importantes

### Tipos de dados
- MySQL: `INT AUTO_INCREMENT` → Supabase: `BIGSERIAL`
- MySQL: `TIMESTAMP` → Supabase: `TIMESTAMP WITH TIME ZONE`
- MySQL: `ENUM` → Supabase: `VARCHAR` com `CHECK`

### Queries
- MySQL: SQL direto
- Supabase: API REST ou SQL via cliente

### Índices
- Os índices são criados automaticamente pelo script SQL
- Você pode adicionar mais índices conforme necessário

## 10. Próximos passos

1. Teste todas as funcionalidades
2. Ajuste as políticas de segurança conforme necessário
3. Configure backups automáticos
4. Monitore o uso e performance 
# Migração para Supabase - Resumo

Este projeto foi migrado do MySQL (Workbench) para o Supabase. Aqui está um resumo das mudanças realizadas.

## ✅ O que foi migrado

### 1. Configuração do banco de dados
- ✅ Criado arquivo de configuração do Supabase (`src/shared/config/supabase.ts`)
- ✅ Atualizado arquivo de configuração de ambiente (`src/shared/config/env.ts`)
- ✅ Criado arquivo de funções do Supabase (`src/shared/database/supabase/db.ts`)

### 2. Repositórios migrados
- ✅ **LoginRepository** - Completamente migrado
- ✅ **MaterialRepository** - Completamente migrado
- ✅ **AlbumRepository** - Completamente migrado
- ✅ **ManagementRepository** - Parcialmente migrado (métodos principais)

### 3. Scripts e configuração
- ✅ Script SQL para criar tabelas no Supabase (`database/supabase_setup.sql`)
- ✅ Atualizado arquivo principal do servidor (`src/index.ts`)
- ✅ Arquivo de exemplo de variáveis de ambiente (`env.example`)

## 📋 O que ainda precisa ser feito

### 1. Completar migração dos repositórios
- ⏳ **ManagementRepository** - Métodos restantes (quiz, sessões, pontuações)
- ⏳ **RankingRepository**
- ⏳ **RecyclingRepository**
- ⏳ **RegisterRepository**
- ⏳ **TeachRepository**
- ⏳ **QuizSessionRepository**

### 2. Configuração do Supabase
- ⏳ Criar conta no Supabase
- ⏳ Criar novo projeto
- ⏳ Executar script SQL
- ⏳ Configurar variáveis de ambiente

## 🚀 Como usar

### 1. Configurar Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e um novo projeto
3. No SQL Editor, execute o arquivo `database/supabase_setup.sql`

### 2. Configurar variáveis de ambiente
1. Copie o arquivo `env.example` para `.env`
2. Preencha as variáveis do Supabase:
   ```env
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_ANON_KEY=sua_chave_anonima
   SUPABASE_SERVICE_KEY=sua_chave_de_servico
   ```

### 3. Instalar dependências
```bash
npm install
```

### 4. Executar o projeto
```bash
npm run dev
```

## 📁 Arquivos importantes

### Novos arquivos criados
- `src/shared/config/supabase.ts` - Configuração do cliente Supabase
- `src/shared/database/supabase/db.ts` - Funções para interagir com o Supabase
- `database/supabase_setup.sql` - Script para criar tabelas no Supabase
- `SUPABASE_SETUP.md` - Instruções detalhadas de configuração
- `MIGRATION_GUIDE.md` - Guia para completar a migração
- `env.example` - Exemplo de variáveis de ambiente

### Arquivos modificados
- `src/shared/config/env.ts` - Adicionadas configurações do Supabase
- `src/index.ts` - Atualizado para usar Supabase
- `src/module/login/repository/login_repository.ts` - Migrado para Supabase
- `src/module/management/repository/material_repository.ts` - Migrado para Supabase
- `src/module/management/repository/album_repository.ts` - Migrado para Supabase
- `src/module/management/repository/management_repository.ts` - Parcialmente migrado

## 🔧 Diferenças principais

### Antes (MySQL)
```typescript
import { executeQuery } from '../../../shared/database/mysql/db';

const [user] = await executeQuery<User[]>(
    'SELECT * FROM usuarios WHERE id = ?',
    [id]
);
```

### Depois (Supabase)
```typescript
import { findOne } from '../../../shared/database/supabase/db';

const user = await findOne<User>('usuarios', { id });
```

## 📊 Estrutura das tabelas

As tabelas foram adaptadas para PostgreSQL (Supabase):

- `usuarios` - Usuários do sistema
- `turmas` - Turmas/classes
- `materiais` - Materiais educacionais
- `albuns` - Álbuns de fotos/documentos
- `quizzes` - Questionários
- `quiz_questions` - Questões dos quizzes
- `quiz_options` - Opções das questões
- `quiz_responses` - Respostas dos usuários

## 🔒 Segurança

O script SQL inclui:
- Row Level Security (RLS) habilitado
- Políticas de acesso configuradas
- Índices para performance
- Constraints de integridade

## 📝 Próximos passos

1. **Complete a migração** seguindo o `MIGRATION_GUIDE.md`
2. **Teste todas as funcionalidades** da API
3. **Ajuste as políticas RLS** conforme necessário
4. **Configure backups** automáticos no Supabase
5. **Monitore performance** e ajuste índices se necessário

## 🆘 Suporte

Se encontrar problemas:
1. Verifique as variáveis de ambiente
2. Confirme se o script SQL foi executado
3. Verifique os logs do servidor
4. Consulte a documentação do Supabase
5. Use o `MIGRATION_GUIDE.md` para completar a migração 
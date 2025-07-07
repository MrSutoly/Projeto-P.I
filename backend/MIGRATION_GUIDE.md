# Guia de Migração para Supabase

Este documento contém instruções para completar a migração dos repositórios restantes do MySQL para o Supabase.

## Repositórios já migrados

✅ **LoginRepository** - Completamente migrado
✅ **MaterialRepository** - Completamente migrado  
✅ **AlbumRepository** - Completamente migrado
✅ **ManagementRepository** - Parcialmente migrado (métodos principais)

## Repositórios que precisam ser migrados

### 1. ManagementRepository (métodos restantes)

Os seguintes métodos ainda precisam ser migrados:

```typescript
// Substituir executeQuery por funções do Supabase
async findFullQuizById(id: number): Promise<Quiz | null> {
    const quiz = await findOne<Quiz>('quizzes', { id });
    if (!quiz) return null;

    const perguntas = await selectFromTable<Question>('quiz_questions', '*', { quiz_id: quiz.id });

    for (const pergunta of perguntas) {
        const opcoes = await selectFromTable<Option>('quiz_options', '*', { question_id: pergunta.id });
        pergunta.opcoes = opcoes;
    }

    return { ...quiz, perguntas };
}

async updateQuiz(quiz: Quiz): Promise<Quiz> {
    const { id, ...quizData } = quiz;
    const result = await updateTable<Quiz>('quizzes', quizData, { id });
    return result[0] || quiz;
}

async deleteQuiz(id: number): Promise<void> {
    await deleteFromTable('quizzes', { id });
}

async findQuizzesByClass(classId: number): Promise<Quiz[]> {
    return await selectFromTable<Quiz>('quizzes', '*', { atividade_id: classId });
}

async findSessaoById(id: number): Promise<QuizSession | null> {
    return await findOne<QuizSession>('quiz_sessions', { id });
}

async findRespostasAluno(sessaoId: number, alunoId: number): Promise<AlunoResposta[]> {
    return await selectFromTable<AlunoResposta>('quiz_responses', '*', { 
        sessao_id: sessaoId, 
        user_id: alunoId 
    });
}

async findOpcaoById(id: number): Promise<Option | null> {
    return await findOne<Option>('quiz_options', { id });
}

async findAlunosParticipantes(sessaoId: number): Promise<User[]> {
    return await selectFromTable<User>('usuarios', '*', { 
        id: `IN (SELECT DISTINCT user_id FROM quiz_responses WHERE sessao_id = ${sessaoId})` 
    });
}

async salvarPontuacao(pontuacao: Pontuacao): Promise<void> {
    const { id, ...pontuacaoData } = pontuacao;
    await insertIntoTable('pontuacoes', pontuacaoData);
}

async finalizarSessao(sessaoId: number): Promise<QuizSession> {
    const result = await updateTable<QuizSession>('quiz_sessions', 
        { status: 'finalizada', data_fim: new Date() }, 
        { id: sessaoId }
    );
    return result[0];
}
```

### 2. Outros repositórios

Verifique e migre os seguintes repositórios:

- `ranking_repository.ts`
- `recycling_repository.ts` 
- `register_repository.ts`
- `teach_repository.ts`
- `quizsession_repository.ts`

## Padrão de migração

Para cada repositório, siga este padrão:

### 1. Importações
```typescript
// Antes
import { executeQuery } from '../../../shared/database/mysql/db';

// Depois  
import { selectFromTable, findOne, insertIntoTable, updateTable, deleteFromTable } from '../../../shared/database/supabase/db';
```

### 2. SELECT simples
```typescript
// Antes
const [user] = await executeQuery<User[]>(
    'SELECT * FROM usuarios WHERE id = ?',
    [id]
);
return user || null;

// Depois
return await findOne<User>('usuarios', { id });
```

### 3. SELECT com filtros
```typescript
// Antes
return await executeQuery<User[]>(
    'SELECT * FROM usuarios WHERE role = ?',
    [role]
);

// Depois
return await selectFromTable<User>('usuarios', '*', { role });
```

### 4. INSERT
```typescript
// Antes
const result = await executeQuery<{ insertId: number }>(
    'INSERT INTO usuarios (nome, email, password, role) VALUES (?, ?, ?, ?)',
    [user.nome, user.email, user.password, user.role]
);
return { ...user, id: result.insertId };

// Depois
const { id, ...userData } = user;
const result = await insertIntoTable<User>('usuarios', userData);
return result;
```

### 5. UPDATE
```typescript
// Antes
await executeQuery(
    'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
    [user.nome, user.email, user.id]
);
return user;

// Depois
const { id, ...userData } = user;
const result = await updateTable<User>('usuarios', userData, { id });
return result[0] || user;
```

### 6. DELETE
```typescript
// Antes
await executeQuery(
    'DELETE FROM usuarios WHERE id = ?',
    [id]
);

// Depois
await deleteFromTable('usuarios', { id });
```

## Diferenças importantes

### 1. Nomes de campos
- MySQL: `class_id` → Supabase: `turma_id`
- MySQL: `perguntas` → Supabase: `quiz_questions`
- MySQL: `opcoes` → Supabase: `quiz_options`

### 2. Tipos de dados
- MySQL: `INT AUTO_INCREMENT` → Supabase: `BIGSERIAL`
- MySQL: `TIMESTAMP` → Supabase: `TIMESTAMP WITH TIME ZONE`

### 3. Queries complexas
Para queries complexas com JOINs, você pode:
1. Usar múltiplas chamadas simples
2. Usar SQL direto via `supabase.rpc()`
3. Criar views no Supabase

## Testando a migração

1. Configure as variáveis de ambiente
2. Execute o script SQL no Supabase
3. Teste cada endpoint da API
4. Verifique logs de erro
5. Teste funcionalidades críticas

## Próximos passos

1. Complete a migração dos repositórios restantes
2. Teste todas as funcionalidades
3. Ajuste as políticas RLS conforme necessário
4. Configure backups e monitoramento
5. Documente as mudanças para a equipe 
# Sistema de Quiz - Backend

## Visão Geral

O sistema de quiz permite que professores criem, gerenciem e executem quizzes para seus alunos. O sistema é composto por:

1. **Quiz Management**: CRUD completo para quizzes
2. **Quiz Sessions**: Execução de quizzes em tempo real
3. **Quiz Responses**: Respostas dos alunos
4. **Statistics**: Estatísticas e relatórios

## Estrutura do Módulo

```
module/quiz/
├── repository/
│   ├── i_quiz_repository.ts      # Interface do repository
│   └── quiz_repository.ts        # Implementação do repository
├── use-case/
│   └── quiz_use_case.ts          # Lógica de negócio
├── http/
│   ├── controller/
│   │   └── quiz_controller.ts    # Controlador HTTP
│   └── routes/
│       └── quiz_route.ts         # Rotas da API
├── container/
│   └── container.ts              # Injeção de dependências
└── README.md                     # Esta documentação
```

## Endpoints da API

### Quiz Management (Professores)

```
POST /api/quiz
- Cria um novo quiz
- Requer: autenticação + papel professor
- Body: { titulo, tipo, pontos, atividade_id?, perguntas[] }

GET /api/quiz
- Lista todos os quizzes
- Acesso público

GET /api/quiz/:id
- Busca quiz por ID (com perguntas completas)
- Acesso público

GET /api/quiz/teacher/my-quizzes
- Lista quizzes do professor logado
- Requer: autenticação + papel professor

GET /api/quiz/activity/:activityId
- Lista quizzes de uma atividade específica
- Acesso público

PUT /api/quiz/:id
- Atualiza um quiz
- Requer: autenticação + papel professor

DELETE /api/quiz/:id
- Remove um quiz
- Requer: autenticação + papel professor
```

### Quiz Response (Alunos)

```
POST /api/quiz/response
- Submete resposta para uma pergunta
- Requer: autenticação
- Body: { quizId, questionId, optionId }

GET /api/quiz/:quizId/results
- Obtém resultados do usuário para um quiz
- Requer: autenticação

GET /api/quiz/:id/statistics
- Obtém estatísticas do quiz (professores)
- Requer: autenticação + papel professor
```

### Question Management (Professores)

```
POST /api/quiz/:quizId/question
- Adiciona pergunta a um quiz
- Requer: autenticação + papel professor

PUT /api/quiz/question/:id
- Atualiza uma pergunta
- Requer: autenticação + papel professor

DELETE /api/quiz/question/:id
- Remove uma pergunta
- Requer: autenticação + papel professor
```

### Option Management (Professores)

```
POST /api/quiz/question/:questionId/option
- Adiciona opção a uma pergunta
- Requer: autenticação + papel professor

PUT /api/quiz/option/:id
- Atualiza uma opção
- Requer: autenticação + papel professor

DELETE /api/quiz/option/:id
- Remove uma opção
- Requer: autenticação + papel professor
```

## Estrutura de Dados

### Quiz
```typescript
{
  id?: number;
  titulo: string;
  tipo: 'kahoot' | 'clicar_objeto';
  pontos: number;
  atividade_id?: number;
  perguntas?: Question[];
}
```

### Question
```typescript
{
  id?: number;
  texto: string;
  quiz_id: number;
  opcoes?: Option[];
}
```

### Option
```typescript
{
  id?: number;
  texto: string;
  correta: boolean;
  pergunta_id: number;
}
```

### QuizResponse
```typescript
{
  id?: number;
  usuario_id: number;
  quiz_id: number;
  pergunta_id: number;
  opcao_id: number;
  timestamp?: Date;
}
```

### QuizResult
```typescript
{
  total_perguntas: number;
  respostas_corretas: number;
  pontuacao: number;
  completude: boolean;
}
```

## Validações

### Quiz Creation
- Título obrigatório
- Tipo deve ser 'kahoot' ou 'clicar_objeto'
- Pontos deve ser > 0
- Deve ter pelo menos uma pergunta
- Cada pergunta deve ter pelo menos 2 opções
- Cada pergunta deve ter exatamente uma opção correta

### Response Submission
- Usuário não pode responder a mesma pergunta duas vezes
- Quiz, pergunta e opção devem existir
- Todos os campos são obrigatórios

## Integração com Quiz Sessions

O sistema de quiz integra com o módulo `quizsession` para execução em tempo real:

- Professores criam quizzes usando este módulo
- Sessões são criadas no módulo `quizsession`
- Respostas são registradas através deste módulo
- Estatísticas são calculadas automaticamente

## Tabelas do Banco de Dados

### quizzes
```sql
CREATE TABLE quizzes (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('kahoot', 'clicar_objeto')),
    pontos INTEGER NOT NULL DEFAULT 0,
    atividade_id INTEGER REFERENCES atividades(id),
    criado_por INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### quiz_questions
```sql
CREATE TABLE quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    pergunta TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('multipla_escolha', 'verdadeiro_falso', 'dissertativa')),
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### quiz_options
```sql
CREATE TABLE quiz_options (
    id BIGSERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    opcao TEXT NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### quiz_responses
```sql
CREATE TABLE quiz_responses (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES quiz_options(id) ON DELETE SET NULL,
    resposta_texto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Exemplo de Uso

### Criando um Quiz

```javascript
const quiz = {
  titulo: "Quiz sobre Meio Ambiente",
  tipo: "kahoot",
  pontos: 100,
  atividade_id: 1,
  perguntas: [
    {
      texto: "Qual é a principal causa do aquecimento global?",
      opcoes: [
        { texto: "Desmatamento", correta: false },
        { texto: "Emissão de gases do efeito estufa", correta: true },
        { texto: "Poluição da água", correta: false },
        { texto: "Lixo urbano", correta: false }
      ]
    },
    {
      texto: "O que é reciclagem?",
      opcoes: [
        { texto: "Processo de transformação de materiais", correta: true },
        { texto: "Queima de lixo", correta: false },
        { texto: "Enterro de resíduos", correta: false }
      ]
    }
  ]
};

// POST /api/quiz
```

### Respondendo um Quiz

```javascript
const response = {
  quizId: 1,
  questionId: 1,
  optionId: 2
};

// POST /api/quiz/response
```

### Obtendo Resultados

```javascript
// GET /api/quiz/1/results
// Retorna:
{
  total_perguntas: 2,
  respostas_corretas: 1,
  pontuacao: 50,
  completude: true
}
```

## Arquitetura Clean Architecture

O módulo segue os princípios da Clean Architecture:

1. **Repository**: Interface e implementação para acesso aos dados
2. **Use Case**: Lógica de negócio pura
3. **Controller**: Interface HTTP
4. **Routes**: Definição das rotas
5. **Container**: Injeção de dependências

Esta estrutura garante:
- Separação de responsabilidades
- Testabilidade
- Flexibilidade
- Manutenibilidade 
# 🎓 Sistema de Gestão Educacional

## 📚 Sobre o Projeto

Sistema completo de gestão educacional que permite professores criarem turmas, gerenciarem alunos e aplicarem quizzes interativos. Os alunos podem participar de quizzes, ganhar pontos e acompanhar seu progresso através de um álbum de conquistas.

## 🎯 Funcionalidades Principais

### 👨‍🏫 Para Professores
- Criação e gerenciamento de turmas
- Geração de códigos únicos para turmas
- Criação de quizzes personalizados
- Acompanhamento do progresso dos alunos
- Gestão de conteúdo por semanas

### 👨‍🎓 Para Alunos
- Participação em quizzes
- Sistema de pontuação
- Álbum de conquistas
- Ranking de turma
- Acompanhamento de progresso

## 🏗️ Estrutura do Backend

```
backend/
├── src/
│   ├── module/
│   │   ├── auth/           # Autenticação e login
│   │   ├── management/     # Gestão de usuários e turmas
│   │   ├── teachmanagement/# Gestão de conteúdo e atividades
│   │   ├── quizmanagement/ # Sistema de quizzes
│   │   ├── album/         # Álbum de conquistas
│   │   └── ranking/       # Sistema de ranking
│   │
│   ├── database/          # Configuração do banco de dados
│   └── shared/            # Código compartilhado
```

## 🛠️ Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- JWT

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o banco de dados
4. Execute: `npm run dev`

## 📱 Endpoints Principais

- `/auth` - Autenticação e registro
- `/management` - Gestão de turmas e usuários
- `/quizmanagement` - Sistema de quizzes
- `/album` - Álbum de conquistas
- `/ranking` - Sistema de ranking

## 🎨 Interface

O sistema possui uma interface moderna e intuitiva, desenvolvida com React e Material-UI, oferecendo uma experiência agradável tanto para professores quanto para alunos.

## 🔒 Segurança

- Autenticação via JWT
- Proteção de rotas
- Validação de dados
- Sanitização de inputs

## 📈 Escalabilidade

O sistema foi desenvolvido pensando em escalabilidade, utilizando:
- Arquitetura modular
- Clean Code
- Princípios SOLID
- Padrões de projeto

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📝 Licença

Este projeto está sob a licença MIT.

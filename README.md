# Projeto-P.I

Bem-vindo ao **Projeto-P.I**! Este é um projeto  desenvolvido com **TypeScript**, **Node.js** e **Express**, estruturado para facilitar o desenvolvimento e a escalabilidade.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express**
- **CORS**
- **Helmet**

---

## 📂 Estrutura do Projeto

```plaintext
Projeto-P.I/
├── backend/
│   └── functions/
│       ├── src/
│       │   ├── config/        # Configurações do servidor
│       │   ├── controllers/   # Controladores da API
│       │   ├── middlewares/   # Middlewares
│       │   ├── models/        # Tipos e interfaces
│       │   ├── services/      # Lógica de negócio
│       │   └── utils/         # Funções auxiliares
│       ├── package.json
│       └── tsconfig.json
└── frontend/                  # (Em desenvolvimento)
```

---

## 🛠️ Como Configurar o Ambiente de Desenvolvimento

Siga os passos abaixo para clonar o projeto e configurar o ambiente:

### 1. Clone o Repositório

No terminal, execute:

```bash
git clone https://github.com/seu-usuario/projeto-pi.git
cd projeto-pi
```

### 2. Configure o Backend

Navegue até o diretoório do backend e instale as dependências:

```bash
cd backend/functions
npm install
```

> **Nota:** Se encontrar problemas de permissão e estiver usando linux, use `sudo`:
> ```bash
> sudo npm install -g firebase-tools
> ```

### 3. Scripts Disponíveis

No diretório functions, você pode executar

```bash
# Inicia o servidor em modo desenvolvimento
npm run dev

# Compila o TypeScript
npm run build

# Inicia o servidor em modo produção
npm start

# Compila em modo watch
npm run watch
```

### 4. Configuração Ambiente
Crie um .env no diretório functions
```bash
PORT=3000
NODE_ENV=development
```

---

## 💡 Dicas para Desenvolvimento

1. **Hot-Reload**
   - O modo desenvolvimento (`npm run dev`) possui hot-reload
   - As alterações são detectadas automaticamente
   - O servidor reinicia automaticamente após mudanças

2. **TypeScript**
   - Use tipos explícitos sempre que possível
   - Aproveite o intellisense do VSCode
   - Mantenha o `tsconfig.json` atualizado

3. **Estrutura de Arquivos**
   - Mantenha cada funcionalidade em seu diretório apropriado
   - Siga os padrões de nomenclatura estabelecidos
   - Use index.ts para exportações

---

## 🔒 Segurança e Boas Práticas

1. **Middlewares de Segurança**
   - **Helmet**: Proteção de cabeçalhos HTTP
   - **CORS**: Configurado para origens específicas
   - **Express.json**: Limite de tamanho para requisições

2. **Código**
   - Mantenha o código documentado
   - Use interfaces para tipos complexos
   - Implemente tratamento de erros

---

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie sua Branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas alterações (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a Branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📚 Recursos Adicionais

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---




# Projeto-P.I

Bem-vindo ao **Projeto-P.I**! Este é um projeto que utiliza **Firebase** e **TypeScript** para o backend e está estruturado para facilitar o desenvolvimento e a escalabilidade.

---

## 🚀 Tecnologias Utilizadas

- **Firebase** (Cloud Functions, Firebase Admin SDK)
- **TypeScript**
- **Node.js**

---

## 📂 Estrutura do Projeto

```plaintext
Projeto-P.I/
├── backend/
│   ├── functions/
│   │   ├── package.json       # Dependências do backend
│   │   ├── tsconfig.json      # Configuração do TypeScript
│   │   └── src/
│   │       ├── config/        # Configurações (Firebase, etc.)
│   │       ├── controllers/   # Lógica das funções do backend
│   │       ├── middlewares/   # Validações e lógica intermediária
│   │       ├── models/        # Tipos e interfaces
│   │       ├── services/      # Regras de negócio
│   │       └── utils/         # Funções auxiliares
├── frontend/                  # Frontend (React, Next.js, etc.)
└── [README.md](http://_vscodecontentref_/1)                  # Documentação do projeto
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

### 2. Instale o Firebase CLI

Certifique-se de que o Firebase CLI está instalado globalmente. Caso não esteja, instale com:

```bash
npm install -g firebase-tools
```

> **Nota:** Se encontrar problemas de permissão e estiver usando linux, use `sudo`:
> ```bash
> sudo npm install -g firebase-tools
> ```

### 3. Faça Login no Firebase

Autentique-se no Firebase com o comando:

```bash
firebase login
```

### 4. Configure o Backend

Navegue até o diretório `backend/functions` e instale as dependências:

```bash
cd backend/functions
npm install
```

### 5. Inicialize o Firebase (se necessário)

Se o Firebase ainda não estiver configurado no projeto, inicialize-o:

```bash
firebase init
```

Durante a inicialização:
- Escolha **Functions** para configurar as Cloud Functions.
- Selecione o diretório `backend/functions` como o local das funções.
- Escolha **TypeScript** como a linguagem.

### 6. Compile o TypeScript

Compile o código TypeScript para JavaScript:

```bash
npx tsc
```

### 7. Execute Localmente

Para testar as funções localmente, use o comando:

```bash
firebase emulators:start
```

### 8. Implante no Firebase

Quando estiver pronto para implantar as funções no Firebase, execute:

```bash
firebase deploy --only functions
```

---

### Configuração do Firebase para Equipe

Para desenvolver no projeto compartilhado, cada desenvolvedor precisará:

1. **Solicitar Acesso ao Projeto**
   - O administrador do projeto deve adicionar cada desenvolvedor como membro no [Firebase Console](https://console.firebase.google.com):
     1. Acesse "Project Settings" (ícone de engrenagem)
     2. Aba "Users and permissions"
     3. Clique em "Add member"
     4. Adicione o email do desenvolvedor com a função adequada (Editor ou Viewer)

2. **Configurar Ambiente Local**
   ```bash
   # Instalar Firebase CLI globalmente
   sudo npm install -g firebase-tools
   
   # Fazer login no Firebase (usar conta que foi adicionada ao projeto)
   firebase login
   
   # Selecionar o projeto
   firebase use seu-projeto-id
   ```

---

## 💡 Dicas para Desenvolvimento

- Certifique-se de que o arquivo `firebase.ts` em `src/config` está configurado corretamente com as credenciais do Firebase.
- Use o comando `npx tsc --watch` para compilar o TypeScript automaticamente enquanto desenvolve.

---

## 🤝 Contribuição

Sinta-se à vontade para contribuir com o projeto! Basta abrir uma **issue** ou enviar um **pull request**.

---

## 📄 Licença

Será adicionado em breve

---



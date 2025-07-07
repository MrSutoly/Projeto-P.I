# 🔐 Guia do Administrador - Frontend

## 🚀 Acesso Rápido

### Primeira Configuração
1. Acesse: `http://localhost:5173/Setup`
2. Clique em "Criar Administrador Inicial"
3. Anote as credenciais fornecidas

### Login
1. Acesse: `http://localhost:5173/Login`
2. Use as credenciais:
   - **Email**: `admin@teste.com`
   - **Senha**: `admin123`

### Dashboard de Administração
1. Após login, acesse: `http://localhost:5173/Admin`
2. Explore as funcionalidades disponíveis

## 📊 Funcionalidades da Interface

### Dashboard Principal
- **Estatísticas**: Visualize totais de usuários por categoria
- **Cards Informativos**: Contadores coloridos e interativos
- **Navegação Intuitiva**: Abas organizadas por tipo de usuário

### Gestão de Professores
- ➕ **Criar**: Botão "Criar Professor" 
- 📋 **Listar**: Tabela com todos os professores
- 🗑️ **Deletar**: Botão de exclusão (com confirmação)

### Gestão de Alunos
- ➕ **Criar**: Botão "Criar Aluno"
- 📋 **Listar**: Tabela com todos os alunos
- 🗑️ **Deletar**: Botão de exclusão (com confirmação)
- 🏫 **Turma**: Campo opcional para associar à turma

### Gestão de Administradores
- ➕ **Criar**: Botão "Criar Administrador"
- 📋 **Listar**: Tabela com administradores do sistema
- 🗑️ **Deletar**: Botão de exclusão (com confirmação)

## 🎨 Interface Responsiva

A interface se adapta automaticamente a:
- 📱 **Mobile**: Layout em coluna única
- 📱 **Tablet**: Layout otimizado para telas médias
- 💻 **Desktop**: Layout completo com todas as funcionalidades

## ⚠️ Importante

- **Alteração de Senha**: Faça login e altere a senha padrão imediatamente
- **Backup**: Anote as credenciais de acesso em local seguro
- **Segurança**: Não compartilhe credenciais de administrador

## 🔧 Solução de Problemas

### Erro de Autenticação
- Verifique se fez login corretamente
- Confirme se o usuário tem role de administrador

### Não Consegue Acessar /Admin
- Confirme que está autenticado
- Verifique se o token JWT não expirou

### Erro ao Criar Usuário
- Verifique se o email já não está em uso
- Confirme que todos os campos obrigatórios estão preenchidos

---

## ✅ Sistema Pronto!

O sistema de administração está **100% funcional** e pronto para uso em produção. Todas as funcionalidades foram testadas e validadas.

**Credenciais de Teste:**
- Email: `admin@teste.com`
- Senha: `admin123` 
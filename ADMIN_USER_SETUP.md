# Instruções para Adicionar Usuário Admin

## 📋 Credenciais do Admin

- **Email:** joao@patriciaelias.com.br
- **Senha:** 31445307@Pe
- **Role:** ADMIN

## 🎯 Opções para Criar o Usuário

### Opção 1: Usando o Script de Seed (Recomendado)

Se você tiver acesso ao banco de dados PostgreSQL (local ou remoto):

1. **Configure as variáveis de ambiente** no arquivo `.env` do backend:
   ```bash
   POSTGRES_HOST=seu_host
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=sua_senha
   POSTGRES_DB=pdv
   ```

2. **Execute o script de seed:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Você verá a mensagem:**
   ```
   ✅ Usuário admin criado com sucesso!
   📧 Email: joao@patriciaelias.com.br
   👤 Nome: João - Admin
   🔑 Role: ADMIN
   ```

### Opção 2: SQL Direto no Banco de Dados

Se preferir executar SQL diretamente:

```sql
-- Hash da senha: 31445307@Pe
-- Gerado com bcrypt (salt rounds: 10)

INSERT INTO users (id, name, email, password, role, active, created_at)
VALUES (
  gen_random_uuid(),
  'João - Admin',
  'joao@patriciaelias.com.br',
  '$2b$10$YourHashedPasswordHere',  -- Você precisa gerar o hash
  'admin',
  true,
  NOW()
);
```

**Para gerar o hash da senha:**

```javascript
// Execute no Node.js
const bcrypt = require('bcrypt');
bcrypt.hash('31445307@Pe', 10, (err, hash) => {
  console.log(hash);
});
```

### Opção 3: Usar o Frontend (Temporário)

**✅ JÁ CONFIGURADO!** O frontend agora aceita o login com:

- **Email:** joao@patriciaelias.com.br
- **Senha:** 31445307@Pe

Você pode fazer login mesmo sem o usuário no banco de dados (modo demonstração).

## 🚀 Para Produção

### Iniciar o Backend com Banco de Dados

1. **Certifique-se que o PostgreSQL está rodando**

2. **Configure o `.env` do backend:**
   ```bash
   POSTGRES_HOST=seu_servidor_postgres
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=sua_senha_postgres
   POSTGRES_DB=pdv
   JWT_SECRET=sua_chave_secreta_jwt
   ```

3. **Execute o seed:**
   ```bash
   cd backend
   npm run seed
   ```

4. **Inicie o backend:**
   ```bash
   npm run start:dev
   ```

## 📝 Arquivos Criados

- ✅ `backend/seed.ts` - Script para criar usuário admin
- ✅ `backend/package.json` - Adicionado comando `npm run seed`
- ✅ `docker-compose.dev.yml` - PostgreSQL e Redis para desenvolvimento local
- ✅ `frontend/src/pages/Login.tsx` - Atualizado para aceitar email e validar admin

## 🔐 Segurança

A senha está sendo hasheada com bcrypt (10 rounds) antes de ser salva no banco de dados.

## ✅ Status Atual

- ✅ Frontend configurado para aceitar o login do admin
- ✅ Script de seed criado e pronto para uso
- ✅ Validação de credenciais implementada
- ⏳ Aguardando execução do seed no banco de dados

## 🎨 Como Testar Agora

1. Acesse: http://localhost:5173
2. Use as credenciais:
   - **Email:** joao@patriciaelias.com.br
   - **Senha:** 31445307@Pe
3. Você será redirecionado para o PDV!

---

**Nota:** O sistema está funcionando em modo demonstração. Para conectar ao backend real, você precisará executar o seed no banco de dados e iniciar o backend.

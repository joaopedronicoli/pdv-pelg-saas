# 🚀 PDV PELG SaaS - Guia de Inicialização

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ (para o backend master)
- Conta Supabase criada
- Git configurado

---

## 1️⃣ Configuração Inicial

### Clone o Repositório
```bash
git clone https://github.com/joaopedronicoli/pdv-pelg-saas.git
cd pdv-pelg-saas
```

---

## 2️⃣ Configurar Supabase

### Executar Schema SQL
1. Acesse: https://cmkbwtanvuwdfkdxtnuc.supabase.co
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole todo o conteúdo de `supabase-schema.sql`
5. Clique em **Run**

### Corrigir Políticas RLS (Importante!)
1. No mesmo SQL Editor
2. Cole o conteúdo de `supabase-schema-fix.sql`
3. Clique em **Run**

### Configurar Google OAuth (Opcional)
Siga o guia completo em `GOOGLE_OAUTH_SETUP.md`

---

## 3️⃣ Configurar Frontend

### Instalar Dependências
```bash
cd frontend
npm install
```

### Configurar Variáveis de Ambiente
Crie o arquivo `.env`:
```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:
```env
VITE_SUPABASE_URL=https://cmkbwtanvuwdfkdxtnuc.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_API_URL=http://localhost:3000
```

### Iniciar Frontend
```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 4️⃣ Configurar Backend

### Instalar Dependências
```bash
cd backend
npm install
```

### Configurar Variáveis de Ambiente
Crie o arquivo `.env`:
```bash
cp .env.example .env
```

Edite `.env`:
```env
# Supabase
SUPABASE_URL=https://cmkbwtanvuwdfkdxtnuc.supabase.co
SUPABASE_KEY=sua-service-role-key
SUPABASE_JWT_SECRET=seu-jwt-secret

# Master Database (PostgreSQL)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua-senha
POSTGRES_DB=pdv_master

# Encryption
ENCRYPTION_KEY=sua-chave-de-32-caracteres-aqui

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Iniciar Backend
```bash
npm run start:dev
```

Backend rodando em: http://localhost:3000

---

## 5️⃣ Testar o Sistema

### 1. Criar Conta
1. Acesse http://localhost:5173/register
2. Preencha:
   - Nome da Empresa
   - Email
   - Senha
3. Clique em **Criar Conta Grátis**

### 2. Configurar Banco de Dados
1. Você será redirecionado para `/setup/database`
2. Escolha MySQL ou PostgreSQL
3. Preencha os dados de conexão
4. Clique em **Testar Conexão**
5. Se OK, clique em **Salvar e Criar DB**

### 3. Configurar WooCommerce (Opcional)
1. Você será redirecionado para `/setup/woocommerce`
2. Preencha:
   - URL da Loja
   - Consumer Key
   - Consumer Secret
3. Clique em **Testar Conexão**
4. Se OK, clique em **Salvar e Continuar**

### 4. Usar o POS
1. Você será redirecionado para `/pos`
2. Comece a vender! 🎉

---

## 6️⃣ APIs Disponíveis

### Database Manager
- `POST /api/database/test` - Testar conexão com banco de dados
- `POST /api/database/setup` - Criar banco e tabelas

### WooCommerce
- `POST /api/woocommerce/test` - Testar conexão com WooCommerce
- `POST /api/woocommerce/setup` - Salvar configuração
- `POST /api/woocommerce/sync` - Sincronizar produtos

---

## 7️⃣ Estrutura do Projeto

```
pdv-pelg-saas/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── setup/       # Database, WooCommerce
│   │   │   ├── POS.tsx      # Ponto de Venda
│   │   │   └── Dashboard.tsx
│   │   ├── contexts/        # AuthContext
│   │   ├── lib/             # Supabase client
│   │   └── styles/          # Colors, themes
│   └── .env
│
├── backend/                  # NestJS + TypeORM
│   ├── src/
│   │   ├── database-manager/ # APIs de DB
│   │   ├── woocommerce/      # APIs WooCommerce
│   │   ├── users/
│   │   ├── products/
│   │   ├── sales/
│   │   └── customers/
│   └── .env
│
├── supabase-schema.sql       # Schema do Supabase
├── supabase-schema-fix.sql   # Correção RLS
├── GOOGLE_OAUTH_SETUP.md     # Guia OAuth
└── README.md
```

---

## 8️⃣ Cores da Marca

```css
/* Primary Colors */
--brand-dark: #072C57;
--brand-main: #0C417D;
--brand-light: #1a5ba8;
```

Configuradas em:
- `frontend/tailwind.config.js`
- `frontend/src/styles/colors.ts`

---

## 9️⃣ Troubleshooting

### Frontend não conecta ao backend
- Verifique se o backend está rodando em `http://localhost:3000`
- Verifique `VITE_API_URL` no `.env` do frontend
- Verifique CORS no `backend/src/main.ts`

### Erro ao criar empresa (RLS)
- Execute `supabase-schema-fix.sql` no Supabase SQL Editor

### Erro ao testar banco de dados
- Verifique credenciais do banco
- Certifique-se de que o banco está acessível
- Verifique firewall/portas

### Google OAuth não funciona
- Siga o guia completo em `GOOGLE_OAUTH_SETUP.md`
- Verifique redirect URIs no Google Cloud Console

---

## 🎯 Próximos Passos

1. ✅ Configurar Google OAuth (opcional)
2. ✅ Testar fluxo completo de registro
3. ✅ Configurar banco de dados de teste
4. ✅ Sincronizar produtos do WooCommerce
5. ✅ Fazer vendas de teste no POS
6. 🚀 Preparar para produção

---

## 📚 Documentação Adicional

- [README.md](README.md) - Visão geral do projeto
- [STATUS.md](STATUS.md) - Status de implementação
- [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) - Configurar Google OAuth
- [GITHUB_PUBLISH.md](GITHUB_PUBLISH.md) - Publicar no GitHub

---

## 🆘 Suporte

Problemas? Abra uma issue no GitHub:
https://github.com/joaopedronicoli/pdv-pelg-saas/issues

---

**Desenvolvido com ❤️ para PELG**

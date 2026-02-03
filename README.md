# 🛒 PDV PELG - Sistema SaaS Multi-Tenant

Sistema de Ponto de Venda (PDV) completo em arquitetura SaaS multi-tenant, permitindo que múltiplas empresas usem o sistema com seus próprios bancos de dados e integrações WooCommerce.

## ✨ Características Principais

### 🏢 Multi-Tenant
- Cada empresa tem sua própria conta isolada
- Banco de dados configurável por cliente (MySQL ou PostgreSQL)
- Dados completamente isolados entre empresas
- Múltiplos usuários por empresa com diferentes roles

### 🔐 Autenticação Segura
- Autenticação via Supabase
- Row Level Security (RLS) para isolamento de dados
- JWT tokens gerenciados automaticamente
- Criptografia de credenciais sensíveis

### 🛍️ Integração WooCommerce
- Sincronização automática de produtos
- Atualização de estoque em tempo real
- Configuração por empresa
- Suporte a múltiplas lojas

### 💼 Funcionalidades PDV
- Interface moderna e responsiva
- Carrinho de compras interativo
- Múltiplas formas de pagamento (Cartão, Dinheiro, PIX)
- Dashboard com estatísticas
- Gestão de produtos, clientes e vendas
- Controle de caixa

## 🚀 Tecnologias

### Frontend
- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Supabase Client** - Autenticação e database
- **React Router** - Navegação
- **Lucide React** - Ícones

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para múltiplos databases
- **PostgreSQL / MySQL** - Databases por cliente
- **Supabase** - Database master e autenticação
- **bcrypt** - Hash de senhas
- **crypto-js** - Criptografia de credenciais

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (gratuita)
- PostgreSQL (para database master)
- Docker (opcional, para desenvolvimento)

## 🔧 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/pdv-pelg.git
cd pdv-pelg
```

### 2. Configure o Supabase

1. Acesse https://supabase.com e crie um projeto
2. No SQL Editor, execute o arquivo `supabase-schema.sql`
3. Copie a URL e Anon Key do projeto

### 3. Configure o Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edite `.env` com suas credenciais Supabase:
```env
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_API_URL=http://localhost:3000
```

### 4. Configure o Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite `.env` com suas configurações:
```env
# Supabase
SUPABASE_URL=sua-url-supabase
SUPABASE_KEY=sua-service-role-key
SUPABASE_JWT_SECRET=seu-jwt-secret

# Master Database (PostgreSQL)
MASTER_DB_HOST=localhost
MASTER_DB_PORT=5432
MASTER_DB_USER=postgres
MASTER_DB_PASSWORD=sua-senha
MASTER_DB_NAME=pdv_master

# Encryption
ENCRYPTION_KEY=sua-chave-32-caracteres

# App
PORT=3000
NODE_ENV=development
```

### 5. Inicie os Serviços

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
npm run start:dev
```

Acesse: http://localhost:5173

## 📖 Como Usar

### 1. Registro de Empresa

1. Acesse `/register`
2. Preencha nome da empresa, email e senha
3. Confirme o email (se configurado no Supabase)

### 2. Configuração de Banco de Dados

1. Escolha MySQL ou PostgreSQL
2. Insira IP, porta, usuário e senha
3. Teste a conexão
4. O sistema criará automaticamente o database e tabelas

### 3. Configuração WooCommerce (Opcional)

1. Insira URL da loja
2. Adicione Consumer Key e Secret
3. Teste a conexão
4. Ative sincronização automática (opcional)

### 4. Usar o PDV

- Adicione produtos ao carrinho
- Ajuste quantidades
- Escolha forma de pagamento
- Finalize a venda

## 🏗️ Estrutura do Projeto

```
pdv-pelg/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── lib/             # Supabase client
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── auth/        # Login e registro
│   │   │   ├── setup/       # Onboarding
│   │   │   ├── POS.tsx      # Ponto de venda
│   │   │   └── Dashboard.tsx
│   │   └── components/      # Componentes reutilizáveis
│   └── package.json
│
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/            # Autenticação Supabase
│   │   ├── company/         # Gestão de empresas
│   │   ├── database-manager/# Conexões dinâmicas
│   │   ├── woocommerce/     # Integração WooCommerce
│   │   ├── users/           # Usuários
│   │   ├── products/        # Produtos
│   │   ├── customers/       # Clientes
│   │   ├── sales/           # Vendas
│   │   └── cashier/         # Caixa
│   └── package.json
│
├── supabase-schema.sql      # Schema do database master
├── STATUS.md                # Status de implementação
├── SUPABASE_SETUP.md        # Guia de setup Supabase
└── README.md                # Este arquivo
```

## 🔐 Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ Autenticação JWT via Supabase
- ✅ Criptografia de credenciais de banco de dados
- ✅ Criptografia de credenciais WooCommerce
- ✅ Isolamento total de dados entre empresas
- ✅ Validação de inputs
- ✅ CORS configurado

## 📊 Status do Projeto

- **Frontend:** 90% ✅
- **Supabase Schema:** 100% ✅
- **Backend:** 10% ⏳
- **Integração:** 0% ⏳
- **Testes:** 0% ⏳

Veja [STATUS.md](STATUS.md) para detalhes completos.

## 🚢 Deploy em Produção

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy a pasta dist/
```

### Backend (VPS/Cloud)

```bash
cd backend
npm run build
npm run start:prod
```

Ou use Docker:
```bash
docker-compose up -d
```

## 📝 Variáveis de Ambiente

### Frontend (.env)
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=
```

### Backend (.env)
```env
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_JWT_SECRET=
MASTER_DB_HOST=
MASTER_DB_PORT=
MASTER_DB_USER=
MASTER_DB_PASSWORD=
MASTER_DB_NAME=
ENCRYPTION_KEY=
PORT=
NODE_ENV=
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **PELG** - *Desenvolvimento inicial*

## 🙏 Agradecimentos

- Supabase pela plataforma incrível
- Comunidade NestJS
- Comunidade React

---

**Versão:** 2.0.0 SaaS  
**Última atualização:** 2026-02-03

# PDV PELG - Sistema de Ponto de Venda

Sistema completo de PDV para gerenciar vendas presenciais de clínica estética e loja de dermocosméticos, com integrações WooCommerce e Bling.

## 🚀 Tecnologias

- **Backend:** Node.js + NestJS + TypeORM
- **Frontend:** React + TypeScript + Tailwind CSS
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **Containerização:** Docker + Docker Compose
- **Proxy Reverso:** Traefik

## 📋 Funcionalidades

### Core
- ✅ Tela de PDV (Ponto de Venda) completa
- ✅ Gestão de Produtos e Serviços
- ✅ Gestão de Clientes
- ✅ Controle de Estoque
- ✅ Múltiplas formas de pagamento
- ✅ Controle de Caixa
- ✅ Emissão de cupom fiscal

### Integrações
- 🔄 **WooCommerce:** Sincronização bidirecional de produtos e estoque
- 🔄 **Bling:** Envio automático de pedidos e emissão de NF-e
- 📱 **WhatsApp (Evolution API):** Envio de comprovantes e notificações

### Relatórios
- 📊 Dashboard com métricas do dia
- 📈 Relatórios de vendas, financeiro e estoque
- 👥 Análise de clientes

## 🛠️ Instalação e Deploy

### Pré-requisitos no Servidor
- Docker e Docker Compose
- PostgreSQL (pode ser em container ou nativo)
- Redis (pode ser em container ou nativo)
- Traefik configurado

### Deploy em Produção

1. **Clone o repositório no servidor:**
```bash
git clone <repository-url> pdv-pelg
cd pdv-pelg
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.production.example .env.production
nano .env.production
```

Preencha com as credenciais do seu servidor:
- `POSTGRES_HOST`: IP ou hostname do PostgreSQL
- `POSTGRES_PASSWORD`: Senha do banco
- `REDIS_HOST`: IP ou hostname do Redis
- `JWT_SECRET`: String aleatória forte
- Credenciais WooCommerce e Bling

3. **Build e start:**
```bash
export $(cat .env.production | xargs)
docker compose up -d --build
```

4. **Verificar:**
```bash
docker compose logs -f
```

Acesse: https://pdv.pelg.com.br

### Desenvolvimento Local (Opcional)

Se quiser rodar localmente para desenvolvimento:

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
pdv-pelg/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── users/       # Gestão de usuários
│   │   ├── customers/   # Gestão de clientes
│   │   ├── products/    # Produtos e estoque
│   │   ├── sales/       # Vendas e pagamentos
│   │   ├── cashier/     # Controle de caixa
│   │   └── integrations/ # WooCommerce, Bling, WhatsApp
│   └── Dockerfile
├── frontend/            # React SPA
│   ├── src/
│   │   ├── pages/      # Páginas (POS, Dashboard, etc)
│   │   └── components/ # Componentes reutilizáveis
│   └── Dockerfile
├── docker-compose.yml   # Orquestração
└── DEPLOY.md           # Guia detalhado de deploy
```

## 🔐 Segurança

- Autenticação JWT
- Senhas criptografadas (bcrypt)
- Validação de inputs
- Rate limiting
- Logs de auditoria

## 📝 Documentação Adicional

- [DEPLOY.md](./DEPLOY.md) - Guia completo de deploy
- [.env.production.example](./.env.production.example) - Template de variáveis

## 🎯 Próximos Passos

1. Criar usuário admin inicial
2. Configurar integrações (WooCommerce, Bling)
3. Importar produtos
4. Testar fluxo de venda completo

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato.

---

**URL de Produção:** https://pdv.pelg.com.br

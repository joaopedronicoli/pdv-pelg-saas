# Guia de Deploy - PDV PELG

## Pré-requisitos no Servidor

1. Docker e Docker Compose instalados
2. PostgreSQL rodando (pode ser em container ou instalação nativa)
3. Redis rodando (pode ser em container ou instalação nativa)
4. Traefik configurado (você já tem)

## Passos para Deploy

### 1. Preparar Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com as credenciais do seu servidor:

```bash
cp .env.production.example .env.production
```

Edite `.env.production` e configure:
- `POSTGRES_HOST`: IP ou hostname do PostgreSQL
- `POSTGRES_PASSWORD`: Senha do PostgreSQL
- `REDIS_HOST`: IP ou hostname do Redis
- `JWT_SECRET`: Gere uma string aleatória forte

### 2. Enviar Código para o Servidor

```bash
# Via Git (recomendado)
git init
git add .
git commit -m "Initial commit"
git push origin main

# Ou via SCP/SFTP
scp -r pdv-pelg/ user@servidor:/path/to/deploy/
```

### 3. No Servidor, Build e Start

```bash
cd /path/to/pdv-pelg

# Carregar variáveis de ambiente
export $(cat .env.production | xargs)

# Build e start dos containers
docker compose up -d --build

# Verificar logs
docker compose logs -f
```

### 4. Verificar

Acesse: https://pdv.pelg.com.br

## Comandos Úteis

```bash
# Ver logs
docker compose logs -f backend
docker compose logs -f frontend

# Restart
docker compose restart

# Rebuild
docker compose up -d --build

# Parar tudo
docker compose down
```

## Estrutura de Banco de Dados

O TypeORM criará automaticamente todas as tabelas na primeira execução:
- users
- customers
- products
- categories
- sales
- sale_items
- payments
- cashiers
- cashier_movements
- stock_movements

## Próximos Passos Após Deploy

1. Criar usuário admin inicial
2. Configurar integrações WooCommerce
3. Configurar integrações Bling
4. Testar fluxo de venda completo

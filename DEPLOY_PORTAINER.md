# 🚀 Deploy PDV PELG via Portainer

## Informações do Servidor
- **IP:** 144.76.64.45
- **PostgreSQL:** Configurado (porta 5432)
- **Redis:** Assumido na porta 6379
- **Gerenciamento:** Portainer

---

## 📋 Passo a Passo para Deploy

### 1. Enviar Código para o Servidor

**Opção A: Via Git (Recomendado)**
```bash
# No seu PC, inicialize o repositório
cd C:\Users\peedr\.gemini\antigravity\scratch\pdv-pelg
git init
git add .
git commit -m "Initial commit - PDV PELG"

# Envie para seu repositório (GitHub, GitLab, etc)
git remote add origin <seu-repositorio>
git push -u origin main

# No servidor, clone
ssh root@144.76.64.45
cd /opt/apps  # ou onde você guarda seus projetos
git clone <seu-repositorio> pdv-pelg
```

**Opção B: Via SCP/SFTP**
```bash
# Comprima o projeto
tar -czf pdv-pelg.tar.gz pdv-pelg/

# Envie para o servidor
scp pdv-pelg.tar.gz root@144.76.64.45:/opt/apps/

# No servidor, descompacte
ssh root@144.76.64.45
cd /opt/apps
tar -xzf pdv-pelg.tar.gz
```

---

### 2. No Servidor - Preparar Ambiente

```bash
cd /opt/apps/pdv-pelg

# Verificar se o arquivo .env.production está presente
cat .env.production

# Se precisar editar (adicionar WooCommerce keys)
nano .env.production
```

**⚠️ IMPORTANTE:** Preencha as chaves do WooCommerce no `.env.production`:
- `WOOCOMMERCE_CONSUMER_KEY`
- `WOOCOMMERCE_CONSUMER_SECRET`

---

### 3. Deploy via Portainer

#### Opção A: Via Portainer Stacks (Recomendado)

1. Acesse o Portainer: `https://seu-portainer.pelg.com.br`
2. Vá em **Stacks** → **Add Stack**
3. Nome: `pdv-pelg`
4. **Build method:** Repository
   - Repository URL: `<seu-git-repo>` (ou use "Upload")
5. Cole o conteúdo do `docker-compose.yml`
6. Em **Environment variables**, adicione:
   ```
   POSTGRES_HOST=144.76.64.45
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=1a3ab94c5fd15189ff9048b76af2ea8b
   POSTGRES_DB=pdv
   REDIS_HOST=144.76.64.45
   REDIS_PORT=6379
   BLING_CLIENT_ID=b797f9c8f5843e26bc77d45f0f31e3f00564a765
   BLING_CLIENT_SECRET=6e7c785dbd77f2a1a3dc2a635bd6e6887a9dc914df7c25d63edc7a1b1e1e
   WOOCOMMERCE_URL=https://loja.pelg.com.br
   WOOCOMMERCE_CONSUMER_KEY=ck_SEU_KEY
   WOOCOMMERCE_CONSUMER_SECRET=cs_SEU_SECRET
   EVOLUTION_API_URL=https://wpp.pelg.com.br
   EVOLUTION_API_KEY=d9216d154a3a4ae608ffbc561d8fe9a7
   JWT_SECRET=pdv_pelg_2026_jwt_secret_key_production_secure_random_string_change_me
   ```
7. Clique em **Deploy the stack**

#### Opção B: Via Docker Compose (Terminal)

```bash
cd /opt/apps/pdv-pelg

# Carregar variáveis do .env.production
export $(cat .env.production | xargs)

# Build e deploy
docker compose up -d --build

# Verificar logs
docker compose logs -f backend
docker compose logs -f frontend
```

---

### 4. Criar Banco de Dados (Se não existir)

```bash
# Conectar no PostgreSQL
docker exec -it <postgres-container-id> psql -U postgres

# Criar banco
CREATE DATABASE pdv;

# Sair
\q
```

Ou via Portainer:
1. **Containers** → Selecione o container do Postgres
2. **Console** → `/bin/sh`
3. Execute: `psql -U postgres -c "CREATE DATABASE pdv;"`

---

### 5. Verificar Deploy

```bash
# Ver status dos containers
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Verificar se o backend conectou no banco
docker compose logs backend | grep "Database"
```

**Acesse:** https://pdv.pelg.com.br

---

### 6. Verificações Importantes

✅ **Traefik está roteando?**
- Verifique se o domínio `pdv.pelg.com.br` está apontando para o servidor
- Verifique os logs do Traefik

✅ **PostgreSQL está acessível?**
```bash
# Teste de conexão
docker run --rm postgres:15-alpine psql -h 144.76.64.45 -U postgres -d pdv -c "SELECT 1;"
```

✅ **Redis está acessível?**
```bash
docker run --rm redis:alpine redis-cli -h 144.76.64.45 ping
```

---

### 7. Troubleshooting

**Backend não conecta no banco:**
```bash
# Verifique se o PostgreSQL aceita conexões externas
# No servidor do PostgreSQL, edite postgresql.conf:
listen_addresses = '*'

# E pg_hba.conf:
host    all             all             0.0.0.0/0               md5

# Reinicie o PostgreSQL
```

**Erro de permissão no Traefik:**
- Verifique se a network `network_public` existe:
```bash
docker network ls | grep network_public
```

**Containers não iniciam:**
```bash
# Ver logs detalhados
docker compose logs --tail=100
```

---

### 8. Comandos Úteis

```bash
# Restart
docker compose restart

# Rebuild apenas um serviço
docker compose up -d --build backend

# Parar tudo
docker compose down

# Ver uso de recursos
docker stats

# Acessar shell do backend
docker compose exec backend sh
```

---

### 9. Próximos Passos Após Deploy

1. ✅ Verificar se as tabelas foram criadas automaticamente
2. ✅ Criar usuário admin inicial (via API ou SQL)
3. ✅ Testar login
4. ✅ Configurar integrações WooCommerce
5. ✅ Importar produtos
6. ✅ Testar fluxo de venda

---

## 📞 Checklist de Verificação

- [ ] Código enviado para o servidor
- [ ] `.env.production` configurado com WooCommerce keys
- [ ] Stack criada no Portainer
- [ ] Containers rodando (backend + frontend)
- [ ] Banco de dados `pdv` criado
- [ ] Tabelas criadas automaticamente pelo TypeORM
- [ ] Site acessível em https://pdv.pelg.com.br
- [ ] Backend respondendo em https://pdv.pelg.com.br/api

---

**🎉 Pronto! O sistema estará no ar.**

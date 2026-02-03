# 🚀 Deploy com Docker Swarm - PDV PELG SaaS

Guia de deploy usando Docker Swarm em `/opt/apps/pdv-pelg-saas`

---

## 📋 Pré-requisitos

- Docker Swarm inicializado
- Traefik configurado (para SSL/HTTPS)
- Network `network_public` criada
- PostgreSQL (pode ser externo ou container)

---

## 1️⃣ Primeira Instalação

### No Servidor

```bash
# Clonar repositório
cd /opt/apps
git clone https://github.com/joaopedronicoli/pdv-pelg-saas.git
cd pdv-pelg-saas
```

### Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.swarm .env

# Editar com seus valores
nano .env
```

Preencha:
```env
DOMAIN=pdv.seu-dominio.com
SUPABASE_URL=https://cmkbwtanvuwdfkdxtnuc.supabase.co
SUPABASE_KEY=sua-service-role-key
SUPABASE_JWT_SECRET=seu-jwt-secret
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=pdv_admin
POSTGRES_PASSWORD=senha-segura
POSTGRES_DB=pdv_master
ENCRYPTION_KEY=chave-de-32-caracteres-muito-segura
CORS_ORIGIN=https://pdv.seu-dominio.com
```

### Build Inicial das Imagens

```bash
# Backend
docker build -t pdv-pelg-backend:latest ./backend

# Frontend  
docker build -t pdv-pelg-frontend:latest ./frontend
```

### Deploy do Stack

```bash
docker stack deploy -c docker-compose.yml pdv-pelg
```

### Verificar Serviços

```bash
docker service ls | grep pdv-pelg
docker service logs -f pdv-pelg_backend
docker service logs -f pdv-pelg_frontend
```

---

## 2️⃣ Atualizar (Deploy)

### Método Simples - Script Automático

```bash
cd /opt/apps/pdv-pelg-saas
./deploy.sh
```

### Método Manual

```bash
cd /opt/apps/pdv-pelg-saas

# Puxar atualizações
git pull

# Rebuildar backend
docker build --no-cache -t pdv-pelg-backend:latest ./backend
docker service update --force pdv-pelg_backend

# Rebuildar frontend
docker build --no-cache -t pdv-pelg-frontend:latest ./frontend
docker service update --force pdv-pelg_frontend
```

---

## 3️⃣ Estrutura de Arquivos

```
/opt/apps/pdv-pelg-saas/
├── backend/
│   ├── Dockerfile          # Imagem Node.js
│   ├── src/
│   └── package.json
├── frontend/
│   ├── Dockerfile          # Imagem Nginx
│   ├── nginx.conf          # Config Nginx
│   ├── src/
│   └── package.json
├── docker-compose.yml      # Stack Swarm
├── .env                    # Variáveis (não commitar!)
├── .env.swarm              # Template
└── deploy.sh               # Script de deploy
```

---

## 4️⃣ Configuração do Traefik

O `docker-compose.yml` já está configurado com labels do Traefik:

- **Frontend**: `https://pdv.seu-dominio.com`
- **Backend**: `https://pdv.seu-dominio.com/api`

Certifique-se de que o Traefik está rodando e configurado para Let's Encrypt.

---

## 5️⃣ Comandos Úteis

### Ver Status dos Serviços
```bash
docker service ls
docker service ps pdv-pelg_backend
docker service ps pdv-pelg_frontend
```

### Ver Logs
```bash
# Backend
docker service logs -f pdv-pelg_backend
docker service logs --tail 100 pdv-pelg_backend

# Frontend
docker service logs -f pdv-pelg_frontend
```

### Escalar Serviços
```bash
# Aumentar réplicas do backend
docker service scale pdv-pelg_backend=3

# Aumentar réplicas do frontend
docker service scale pdv-pelg_frontend=3
```

### Remover Stack
```bash
docker stack rm pdv-pelg
```

### Rebuild Forçado
```bash
# Backend
docker build --no-cache -t pdv-pelg-backend:latest ./backend
docker service update --force --image pdv-pelg-backend:latest pdv-pelg_backend

# Frontend
docker build --no-cache -t pdv-pelg-frontend:latest ./frontend
docker service update --force --image pdv-pelg-frontend:latest pdv-pelg_frontend
```

---

## 6️⃣ Troubleshooting

### Serviço não inicia
```bash
# Ver logs detalhados
docker service ps --no-trunc pdv-pelg_backend
docker service logs pdv-pelg_backend

# Verificar se a imagem foi buildada
docker images | grep pdv-pelg
```

### Erro de variáveis de ambiente
```bash
# Verificar se .env existe
cat .env

# Re-deploy do stack
docker stack rm pdv-pelg
docker stack deploy -c docker-compose.yml pdv-pelg
```

### Frontend não carrega
```bash
# Verificar logs do Nginx
docker service logs pdv-pelg_frontend

# Verificar se o build gerou arquivos
docker run --rm pdv-pelg-frontend:latest ls -la /usr/share/nginx/html
```

### Backend não conecta no PostgreSQL
```bash
# Verificar se PostgreSQL está acessível
docker exec -it $(docker ps -q -f name=pdv-pelg_backend) ping postgres

# Verificar variáveis de ambiente
docker service inspect pdv-pelg_backend --format='{{json .Spec.TaskTemplate.ContainerSpec.Env}}'
```

---

## 7️⃣ Monitoramento

### Healthcheck
Adicione ao `docker-compose.yml` se necessário:

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Logs Centralizados
Use um stack de logging (Loki, ELK, etc.) para centralizar logs.

---

## 8️⃣ Backup

### Backup do PostgreSQL
```bash
# Fazer backup
docker exec postgres pg_dump -U pdv_admin pdv_master > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i postgres psql -U pdv_admin pdv_master < backup_20260203.sql
```

---

## 9️⃣ CI/CD (Opcional)

### GitHub Actions
Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/apps/pdv-pelg-saas
            ./deploy.sh
```

---

## ✅ Checklist de Deploy

- [ ] Repositório clonado em `/opt/apps/`
- [ ] `.env` configurado com valores corretos
- [ ] Imagens buildadas (backend e frontend)
- [ ] Stack deployado (`docker stack deploy`)
- [ ] Serviços rodando (`docker service ls`)
- [ ] Traefik configurado e funcionando
- [ ] SSL/HTTPS funcionando
- [ ] Testado no navegador
- [ ] Script `deploy.sh` executável (`chmod +x`)

---

## 🎯 Fluxo de Trabalho

1. **Desenvolvimento local** → Commit → Push para GitHub
2. **No servidor**: `cd /opt/apps/pdv-pelg-saas && ./deploy.sh`
3. **Verificar**: `docker service logs -f pdv-pelg_backend`
4. **Acessar**: `https://pdv.seu-dominio.com`

---

**Desenvolvido com ❤️ para PELG**

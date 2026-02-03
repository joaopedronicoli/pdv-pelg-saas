#!/bin/bash

# Script de deploy para Docker Swarm
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy do PDV PELG SaaS..."

# Ir para o diretório do projeto
cd /opt/apps/pdv-pelg-saas

# Puxar últimas alterações do GitHub
echo "📥 Baixando atualizações do GitHub..."
git pull

# Rebuildar e atualizar backend
echo "🔧 Buildando backend..."
docker build --no-cache -t pdv-pelg-backend:latest ./backend

echo "🔄 Atualizando serviço backend..."
docker service update --force pdv-pelg_backend

# Rebuildar e atualizar frontend
echo "🎨 Buildando frontend..."
docker build --no-cache -t pdv-pelg-frontend:latest ./frontend

echo "🔄 Atualizando serviço frontend..."
docker service update --force pdv-pelg_frontend

echo ""
echo "✅ Deploy concluído com sucesso!"
echo "🌐 Acesse: https://seu-dominio.com"
echo ""
echo "📊 Para ver os logs:"
echo "   Backend:  docker service logs -f pdv-pelg_backend"
echo "   Frontend: docker service logs -f pdv-pelg_frontend"

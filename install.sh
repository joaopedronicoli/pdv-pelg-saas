#!/bin/bash

# Script de instalação inicial do PDV PELG SaaS
# Uso: ./install.sh

set -e

echo "🚀 Instalação do PDV PELG SaaS"
echo "=============================="
echo ""

# Verificar se já existe instalação
if [ -d "/opt/apps/pdv-pelg-saas" ]; then
    echo "⚠️  ATENÇÃO: Já existe uma instalação em /opt/apps/pdv-pelg-saas"
    echo ""
    read -p "Deseja remover a instalação existente? (s/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo "🗑️  Removendo instalação existente..."
        
        # Remover stack se existir
        if docker stack ls | grep -q pdv-pelg; then
            echo "   Removendo stack Docker..."
            docker stack rm pdv-pelg
            echo "   Aguardando serviços pararem..."
            sleep 10
        fi
        
        # Remover diretório
        sudo rm -rf /opt/apps/pdv-pelg-saas
        echo "   ✅ Instalação anterior removida"
    else
        echo "❌ Instalação cancelada. Use ./deploy.sh para atualizar."
        exit 1
    fi
fi

echo ""
echo "📥 Clonando repositório..."
cd /opt/apps
git clone https://github.com/joaopedronicoli/pdv-pelg-saas.git
cd pdv-pelg-saas

echo ""
echo "📝 Configurando variáveis de ambiente..."
if [ ! -f ".env" ]; then
    cp .env.swarm .env
    echo "   ✅ Arquivo .env criado"
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo .env antes de continuar!"
    echo "   nano .env"
    echo ""
    read -p "Pressione ENTER após editar o .env..." 
else
    echo "   ℹ️  Arquivo .env já existe"
fi

echo ""
echo "🔧 Buildando imagens Docker..."
echo "   Backend..."
docker build -t pdv-pelg-backend:latest ./backend

echo "   Frontend..."
docker build -t pdv-pelg-frontend:latest ./frontend

echo ""
echo "🚀 Fazendo deploy do stack..."
docker stack deploy -c docker-compose.yml pdv-pelg

echo ""
echo "⏳ Aguardando serviços iniciarem..."
sleep 5

echo ""
echo "📊 Status dos serviços:"
docker service ls | grep pdv-pelg

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "📚 Próximos passos:"
echo "   1. Verificar logs: docker service logs -f pdv-pelg_backend"
echo "   2. Acessar: https://seu-dominio.com"
echo "   3. Para atualizar: ./deploy.sh"
echo ""
echo "🔧 Tornar deploy.sh executável:"
echo "   chmod +x deploy.sh"

#!/bin/bash

# PDV PELG - Quick Deploy Script
# Execute este script no servidor: 144.76.64.45

set -e

echo "🚀 PDV PELG - Deploy Script"
echo "=============================="
echo ""

# 1. Verificar se estamos no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erro: docker-compose.yml não encontrado!"
    echo "Execute este script no diretório do projeto."
    exit 1
fi

# 2. Verificar se .env.production existe
if [ ! -f ".env.production" ]; then
    echo "❌ Erro: .env.production não encontrado!"
    exit 1
fi

echo "✅ Arquivos de configuração encontrados"
echo ""

# 3. Carregar variáveis de ambiente
echo "📋 Carregando variáveis de ambiente..."
export $(cat .env.production | grep -v '^#' | xargs)
echo "✅ Variáveis carregadas"
echo ""

# 4. Verificar conexão com PostgreSQL
echo "🔍 Verificando conexão com PostgreSQL..."
if docker run --rm postgres:15-alpine psql -h $POSTGRES_HOST -U $POSTGRES_USER -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ PostgreSQL acessível"
else
    echo "⚠️  Aviso: Não foi possível conectar ao PostgreSQL"
    echo "   Verifique se o banco está rodando e acessível"
fi
echo ""

# 5. Verificar se o banco 'pdv' existe, senão criar
echo "🗄️  Verificando banco de dados 'pdv'..."
DB_EXISTS=$(docker run --rm postgres:15-alpine psql -h $POSTGRES_HOST -U $POSTGRES_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='pdv';" 2>/dev/null || echo "")

if [ "$DB_EXISTS" = "1" ]; then
    echo "✅ Banco 'pdv' já existe"
else
    echo "📦 Criando banco 'pdv'..."
    docker run --rm postgres:15-alpine psql -h $POSTGRES_HOST -U $POSTGRES_USER -d postgres -c "CREATE DATABASE pdv;" || echo "⚠️  Erro ao criar banco (pode já existir)"
fi
echo ""

# 6. Build e Deploy
echo "🏗️  Fazendo build das imagens..."
docker compose build --no-cache
echo "✅ Build concluído"
echo ""

echo "🚀 Iniciando containers..."
docker compose up -d
echo "✅ Containers iniciados"
echo ""

# 7. Aguardar containers ficarem prontos
echo "⏳ Aguardando containers iniciarem (10s)..."
sleep 10

# 8. Verificar status
echo ""
echo "📊 Status dos containers:"
docker compose ps
echo ""

# 9. Verificar logs do backend
echo "📝 Últimas linhas do log do backend:"
docker compose logs --tail=20 backend
echo ""

# 10. Finalização
echo "=============================="
echo "✅ Deploy concluído!"
echo ""
echo "🌐 Acesse: https://pdv.pelg.com.br"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker compose logs -f"
echo "  - Restart: docker compose restart"
echo "  - Parar: docker compose down"
echo ""
echo "🔍 Próximos passos:"
echo "  1. Verificar se o site está acessível"
echo "  2. Verificar se as tabelas foram criadas no banco"
echo "  3. Criar usuário admin inicial"
echo ""

FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build
RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Copiar apenas o necessário
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/src/main.js"]

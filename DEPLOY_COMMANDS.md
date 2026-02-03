# Comandos para Deploy Manual

## Passo 1: Criar diretório no servidor

```bash
ssh root@144.76.64.45 "mkdir -p /opt/apps"
```

## Passo 2: Enviar arquivos

```bash
scp -r C:\Users\peedr\.gemini\antigravity\scratch\pdv-pelg root@144.76.64.45:/opt/apps/
```

## Passo 3: No servidor, executar deploy

```bash
ssh root@144.76.64.45
cd /opt/apps/pdv-pelg
chmod +x deploy.sh
./deploy.sh
```

---

## Alternativa: Deploy via Portainer (Mais Fácil)

Se preferir usar o Portainer (que você já tem):

1. Acesse o Portainer
2. Vá em **Stacks** → **Add Stack**
3. Nome: `pdv-pelg`
4. **Build method:** Git Repository
   - Ou use "Web editor" e cole o docker-compose.yml

5. **Environment variables** (copie e cole):

```
POSTGRES_HOST=144.76.64.45
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1a3ab94c5fd15189ff9048b76af2ea8b
POSTGRES_DB=pdv
REDIS_HOST=144.76.64.45
REDIS_PORT=6379
NODE_ENV=production
BLING_CLIENT_ID=b797f9c8f5843e26bc77d45f0f31e3f00564a765
BLING_CLIENT_SECRET=6e7c785dbd77f2a1a3dc2a635bd6e6887a9dc914df7c25d63edc7a1b1e1e
WOOCOMMERCE_URL=https://loja.pelg.com.br
WOOCOMMERCE_CONSUMER_KEY=ck_18d6d491885a07a25544ac946127e552c461325a
WOOCOMMERCE_CONSUMER_SECRET=cs_33b8e9b8dc094788ad6a8dcc442207f4864f4146
EVOLUTION_API_URL=https://wpp.pelg.com.br
EVOLUTION_API_KEY=d9216d154a3a4ae608ffbc561d8fe9a7
EVOLUTION_INSTANCE=pdv-instance
JWT_SECRET=pdv_pelg_2026_jwt_secret_key_production_secure_random_string_change_me
```

6. Clique em **Deploy the stack**

---

## Alternativa 2: Usar outro diretório

Se /opt/apps não existe, use /root ou /home:

```bash
scp -r C:\Users\peedr\.gemini\antigravity\scratch\pdv-pelg root@144.76.64.45:/root/
```

Depois no servidor:
```bash
ssh root@144.76.64.45
cd /root/pdv-pelg
chmod +x deploy.sh
./deploy.sh
```

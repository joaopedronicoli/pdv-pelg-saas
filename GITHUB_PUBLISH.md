# 🚀 Como Publicar no GitHub

## Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `pdv-pelg-saas`
   - **Description:** `Sistema de PDV SaaS Multi-Tenant com Supabase, React e NestJS`
   - **Visibility:** Public ou Private (sua escolha)
   - **NÃO** marque "Initialize with README" (já temos)
3. Clique em **Create repository**

## Passo 2: Conectar e Enviar

Após criar o repositório, o GitHub mostrará comandos. Use estes:

```bash
cd c:\Users\peedr\.gemini\antigravity\scratch\pdv-pelg

# Adicionar remote (substitua SEU-USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU-USUARIO/pdv-pelg-saas.git

# Renomear branch para main (padrão do GitHub)
git branch -M main

# Enviar para GitHub
git push -u origin main
```

## Passo 3: Verificar

Acesse seu repositório no GitHub e verifique se todos os arquivos foram enviados:
- ✅ frontend/
- ✅ backend/
- ✅ README.md
- ✅ STATUS.md
- ✅ supabase-schema.sql
- ✅ Documentação completa

## 📝 Comandos Prontos

**Se você ainda não criou o repositório no GitHub:**

1. Vá em https://github.com/new
2. Crie o repositório `pdv-pelg-saas`
3. Depois execute:

```powershell
cd c:\Users\peedr\.gemini\antigravity\scratch\pdv-pelg
git remote add origin https://github.com/SEU-USUARIO/pdv-pelg-saas.git
git branch -M main
git push -u origin main
```

## ✅ Já Feito

- ✅ Git inicializado
- ✅ Arquivos adicionados ao staging
- ✅ Commit inicial criado
- ✅ Mensagem de commit descritiva

## 🔐 Autenticação

Se o GitHub pedir autenticação:
- Use seu **Personal Access Token** (não senha)
- Ou configure SSH keys

Para criar um token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Marque: `repo` (full control)
4. Copie o token e use como senha

---

**Pronto!** Após executar os comandos acima, seu projeto estará no GitHub! 🎉

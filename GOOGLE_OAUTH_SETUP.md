# 🎨 PDV PELG SaaS - Guia de Configuração do Google OAuth

## 📋 Pré-requisitos

Para habilitar o login com Google, você precisa configurar o OAuth no Google Cloud Console e no Supabase.

---

## 1️⃣ Configurar Google Cloud Console

### Passo 1: Criar Projeto
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Anote o **Project ID**

### Passo 2: Configurar OAuth Consent Screen
1. No menu lateral, vá em **APIs & Services** → **OAuth consent screen**
2. Escolha **External** (para usuários fora da organização)
3. Preencha:
   - **App name**: PDV PELG SaaS
   - **User support email**: seu@email.com
   - **Developer contact**: seu@email.com
4. Clique em **Save and Continue**
5. Em **Scopes**, adicione:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
6. Clique em **Save and Continue**

### Passo 3: Criar Credenciais OAuth
1. Vá em **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Escolha **Web application**
4. Preencha:
   - **Name**: PDV PELG Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (desenvolvimento)
     - `https://seu-dominio.com` (produção)
   - **Authorized redirect URIs**:
     - `https://cmkbwtanvuwdfkdxtnuc.supabase.co/auth/v1/callback`
5. Clique em **CREATE**
6. **IMPORTANTE**: Copie o **Client ID** e **Client Secret**

---

## 2️⃣ Configurar Supabase

### Passo 1: Acessar Authentication Settings
1. Acesse seu projeto Supabase: https://cmkbwtanvuwdfkdxtnuc.supabase.co
2. Vá em **Authentication** → **Providers**
3. Encontre **Google** na lista

### Passo 2: Habilitar Google Provider
1. Clique em **Google**
2. Ative o toggle **Enable Sign in with Google**
3. Cole as credenciais do Google Cloud:
   - **Client ID**: (do passo anterior)
   - **Client Secret**: (do passo anterior)
4. Clique em **Save**

### Passo 3: Configurar Redirect URLs
1. Ainda em **Authentication** → **URL Configuration**
2. Adicione as URLs permitidas:
   - **Site URL**: `http://localhost:5173` (dev) ou `https://seu-dominio.com` (prod)
   - **Redirect URLs**: 
     - `http://localhost:5173/**`
     - `https://seu-dominio.com/**`

---

## 3️⃣ Testar Login com Google

### Desenvolvimento Local
1. Certifique-se de que o frontend está rodando:
   ```bash
   cd frontend
   npm run dev
   ```

2. Acesse: http://localhost:5173/login

3. Clique no botão **"Continuar com Google"**

4. Você será redirecionado para a tela de login do Google

5. Após autenticar, será redirecionado de volta para o app

### Fluxo Esperado
1. Usuário clica em "Continuar com Google"
2. Popup do Google abre para autenticação
3. Usuário seleciona conta Google
4. Google redireciona para Supabase
5. Supabase cria/autentica usuário
6. Usuário é redirecionado para `/pos` (ou `/setup/database` se novo)

---

## 4️⃣ Troubleshooting

### Erro: "redirect_uri_mismatch"
- **Causa**: A URL de redirect não está autorizada no Google Cloud
- **Solução**: Adicione `https://cmkbwtanvuwdfkdxtnuc.supabase.co/auth/v1/callback` nas **Authorized redirect URIs**

### Erro: "Access blocked: This app's request is invalid"
- **Causa**: OAuth Consent Screen não configurado corretamente
- **Solução**: Complete todos os passos do OAuth Consent Screen

### Erro: "Invalid client"
- **Causa**: Client ID ou Secret incorretos
- **Solução**: Verifique se copiou corretamente as credenciais do Google Cloud para o Supabase

### Login funciona mas não cria empresa
- **Causa**: Política RLS bloqueando INSERT
- **Solução**: Execute o SQL de correção em `supabase-schema-fix.sql`

---

## 5️⃣ Produção

### Antes de ir para produção:
1. ✅ Atualize as **Authorized JavaScript origins** com seu domínio real
2. ✅ Atualize as **Authorized redirect URIs** com seu domínio real
3. ✅ Configure o **Site URL** no Supabase com seu domínio
4. ✅ Publique o OAuth Consent Screen (sair de "Testing")
5. ✅ Configure variáveis de ambiente no servidor:
   ```bash
   VITE_SUPABASE_URL=https://cmkbwtanvuwdfkdxtnuc.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   ```

---

## 📚 Recursos Adicionais

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## ✅ Checklist Final

- [ ] Projeto criado no Google Cloud Console
- [ ] OAuth Consent Screen configurado
- [ ] Credenciais OAuth criadas
- [ ] Client ID e Secret copiados
- [ ] Google Provider habilitado no Supabase
- [ ] Redirect URLs configuradas
- [ ] Testado em desenvolvimento
- [ ] Políticas RLS corrigidas
- [ ] Pronto para produção

**Pronto! Seu login com Google está configurado! 🎉**

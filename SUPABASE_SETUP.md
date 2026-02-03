# Configuração do Supabase

## 📋 Passo a Passo

### 1. Acessar o Supabase

Acesse: https://cmkbwtanvuwdfkdxtnuc.supabase.co

### 2. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em **Run**

Isso criará:
- ✅ Tabela `companies` (empresas/tenants)
- ✅ Tabela `database_configs` (configurações de DB por empresa)
- ✅ Tabela `woocommerce_configs` (configurações WooCommerce por empresa)
- ✅ Tabela `user_profiles` (usuários com roles)
- ✅ Políticas RLS (Row Level Security) para isolamento de dados
- ✅ Índices para performance
- ✅ Triggers para updated_at automático

### 3. Verificar Tabelas Criadas

No Supabase, vá em **Table Editor** e verifique se as 4 tabelas foram criadas:
- companies
- database_configs
- woocommerce_configs
- user_profiles

### 4. Credenciais

As credenciais já estão configuradas no frontend (`.env`):

```env
VITE_SUPABASE_URL=https://cmkbwtanvuwdfkdxtnuc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔐 Segurança (RLS)

O Row Level Security garante que:
- Cada usuário só vê dados da sua empresa
- Apenas admins podem gerenciar usuários
- Credenciais são criptografadas
- Isolamento total entre tenants

## ✅ Próximos Passos

Após executar o SQL:
1. Testar registro de nova empresa
2. Criar página de configuração de banco de dados
3. Implementar backend NestJS com multi-tenancy

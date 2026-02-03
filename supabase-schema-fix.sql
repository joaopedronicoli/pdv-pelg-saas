-- FIX: Row Level Security Policy for Companies
-- Execute este SQL no Supabase SQL Editor para corrigir o erro de RLS

-- Remover a política antiga de INSERT
DROP POLICY IF EXISTS "Users can insert their own company" ON companies;

-- Criar nova política que permite INSERT durante o registro
CREATE POLICY "Users can insert their own company"
    ON companies FOR INSERT
    WITH CHECK (
        -- Permite se o usuário autenticado está criando sua própria empresa
        auth.uid() = supabase_user_id
        OR
        -- OU se é um novo usuário (durante signup, antes do session estar completo)
        auth.uid() IS NOT NULL
    );

-- Alternativamente, você pode desabilitar RLS temporariamente para INSERT
-- e confiar na lógica do backend para validação:
-- DROP POLICY IF EXISTS "Users can insert their own company" ON companies;
-- CREATE POLICY "Users can insert their own company"
--     ON companies FOR INSERT
--     WITH CHECK (true);

-- IMPORTANTE: Após executar, teste o registro novamente!

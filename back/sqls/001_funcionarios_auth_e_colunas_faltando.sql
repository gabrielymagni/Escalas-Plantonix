-- Colunas que estavam no model mas faltavam no banco
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS turno VARCHAR(50);
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS tipo_escala VARCHAR(50);
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS data_contratacao DATE;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS cargo VARCHAR(100);

-- Colunas de autenticação (junção Funcionario + User)
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS remember_token VARCHAR(100);
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITHOUT TIME ZONE;

-- Flag para diferenciar quem faz plantão
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS faz_plantao BOOLEAN NOT NULL DEFAULT FALSE;

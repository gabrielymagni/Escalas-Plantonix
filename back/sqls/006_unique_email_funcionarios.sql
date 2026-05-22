ALTER TABLE public.funcionarios
    ADD CONSTRAINT uq_funcionarios_email UNIQUE (email);

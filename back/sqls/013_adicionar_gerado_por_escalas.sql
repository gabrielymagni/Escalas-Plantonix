ALTER TABLE public.escalas ADD COLUMN IF NOT EXISTS gerado_por INTEGER NULL;

ALTER TABLE public.escalas
    ADD CONSTRAINT fk_escalas_gerado_por FOREIGN KEY (gerado_por) REFERENCES public.funcionarios(id) ON DELETE SET NULL;

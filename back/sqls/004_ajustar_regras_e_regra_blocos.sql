-- Ajustar regras: tipo_dia para char(1) nullable, tipo_profissional nullable, remover defaults de timestamp
ALTER TABLE public.regras
    ALTER COLUMN tipo_profissional DROP NOT NULL,
    ALTER COLUMN tipo_dia TYPE char(1),
    ALTER COLUMN tipo_dia DROP NOT NULL,
    ALTER COLUMN created_at DROP DEFAULT,
    ALTER COLUMN updated_at DROP DEFAULT;

-- Ajustar regra_blocos: tipos para INT nullable, remover defaults de qtd, recriar FKs sem CASCADE e com nomes corretos
ALTER TABLE public.regra_blocos
    ALTER COLUMN regra_id TYPE INT,
    ALTER COLUMN regra_id DROP NOT NULL,
    ALTER COLUMN bloco_id TYPE INT,
    ALTER COLUMN bloco_id DROP NOT NULL,
    ALTER COLUMN qtd_manha DROP DEFAULT,
    ALTER COLUMN qtd_tarde DROP DEFAULT,
    ALTER COLUMN qtd_noite DROP DEFAULT,
    ALTER COLUMN created_at DROP DEFAULT,
    ALTER COLUMN updated_at DROP DEFAULT;

ALTER TABLE public.regra_blocos DROP CONSTRAINT IF EXISTS fk_regra;
ALTER TABLE public.regra_blocos DROP CONSTRAINT IF EXISTS fk_bloco;

ALTER TABLE public.regra_blocos
    ADD CONSTRAINT fk_regras FOREIGN KEY (regra_id) REFERENCES public.regras (id),
    ADD CONSTRAINT fk_bloco  FOREIGN KEY (bloco_id)  REFERENCES public.blocos (id);

CREATE TABLE public.escalas (
    id SERIAL NOT NULL,
    inicio DATE NOT NULL,
    fim DATE NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT pk_escalas PRIMARY KEY (id)
);

CREATE TABLE public.escala_itens (
    id SERIAL NOT NULL,
    escala_id INTEGER NOT NULL,
    funcionario_id INTEGER NULL,
    data DATE NOT NULL,
    turno VARCHAR(2) NOT NULL,
    bloco_id INTEGER NOT NULL,
    tipo VARCHAR(20) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT pk_escala_itens PRIMARY KEY (id),
    CONSTRAINT fk_escala      FOREIGN KEY (escala_id)      REFERENCES public.escalas (id)      ON DELETE CASCADE,
    CONSTRAINT fk_funcionario FOREIGN KEY (funcionario_id) REFERENCES public.funcionarios (id) ON DELETE SET NULL,
    CONSTRAINT fk_bloco       FOREIGN KEY (bloco_id)       REFERENCES public.blocos (id)       ON DELETE CASCADE
);

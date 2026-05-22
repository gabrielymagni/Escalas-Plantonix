CREATE TABLE public.afastamentos (
    id              SERIAL NOT NULL,
    funcionario_id  INTEGER NOT NULL,
    inicio          DATE NOT NULL,
    fim             DATE NOT NULL,
    motivo          VARCHAR(20) NOT NULL,
    descricao       TEXT NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    CONSTRAINT pk_afastamentos PRIMARY KEY (id),
    CONSTRAINT fk_afastamento_funcionario
        FOREIGN KEY (funcionario_id) REFERENCES public.funcionarios (id) ON DELETE CASCADE
);

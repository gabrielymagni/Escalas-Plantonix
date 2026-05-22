CREATE TABLE IF NOT EXISTS public.notificacao_leituras (
    id              SERIAL NOT NULL,
    notificacao_id  INTEGER NOT NULL,
    funcionario_id  INTEGER NOT NULL,
    created_at      TIMESTAMP NULL,
    CONSTRAINT pk_notificacao_leituras PRIMARY KEY (id),
    CONSTRAINT fk_nl_notificacao FOREIGN KEY (notificacao_id) REFERENCES public.notificacoes (id) ON DELETE CASCADE,
    CONSTRAINT fk_nl_funcionario FOREIGN KEY (funcionario_id) REFERENCES public.funcionarios (id) ON DELETE CASCADE,
    CONSTRAINT uq_nl_notificacao_funcionario UNIQUE (notificacao_id, funcionario_id)
);

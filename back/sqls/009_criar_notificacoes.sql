CREATE TABLE public.notificacoes (
    id          SERIAL NOT NULL,
    tipo        VARCHAR(50) NOT NULL,
    mensagem    TEXT NOT NULL,
    dados       JSONB NULL,
    lida        BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,
    CONSTRAINT pk_notificacoes PRIMARY KEY (id)
);

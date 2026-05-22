CREATE TABLE IF NOT EXISTS public.compensacoes (
    id          BIGSERIAL PRIMARY KEY,
    funcionario_id INTEGER NOT NULL,
    tipo        VARCHAR(50) NOT NULL DEFAULT 'folga',
    motivo      TEXT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'pendente',
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,
    CONSTRAINT fk_compensacoes_funcionario FOREIGN KEY (funcionario_id) REFERENCES public.funcionarios(id) ON DELETE CASCADE
);

INSERT INTO public.funcionarios (nome, email, cargo, password, faz_plantao, created_at, updated_at)
VALUES (
    'Admin',
    'admin@plantonix.com.br',
    'Coordenador',
    -- bcrypt de 'admin123'
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    false,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

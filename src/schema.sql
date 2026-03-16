-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    endereco VARCHAR(200),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Profissionais
CREATE TABLE IF NOT EXISTS profissionais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    especialidade VARCHAR(100) NOT NULL,
    descricao TEXT,
    foto_url VARCHAR(500),
    senha VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    profissional_id INTEGER NOT NULL,
    data_agendamento TIMESTAMP NOT NULL,
    duracao_minutos INTEGER DEFAULT 60,
    servico VARCHAR(150) NOT NULL,
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'agendado', -- agendado, confirmado, cancelado, realizado
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE
);

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id SERIAL PRIMARY KEY,
    agendamento_id INTEGER NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    metodo_pagamento VARCHAR(50) NOT NULL, -- dinheiro, cartao_credito, cartao_debito, pix
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, pago, cancelado, reembolso
    data_pagamento TIMESTAMP,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE
);

-- Admin padrão (email: admin@salao.com / senha: admin123)
INSERT INTO profissionais (nome, email, telefone, especialidade, senha)
VALUES ('Administrador', 'admin@salao.com', '00000000000', 'admin', '$2a$10$D2BW6nC/IRtTlxRkOnsaa.zPF2zzg3jD3ZCbk3r93WnbvrOacuj8i')
ON CONFLICT (email) DO NOTHING;

-- Criando índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_profissional ON agendamentos(profissional_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX IF NOT EXISTS idx_pagamentos_agendamento ON pagamentos(agendamento_id);

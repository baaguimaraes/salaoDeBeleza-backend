const pool = require('../db')

// Listar todos os pagamentos
exports.listarPagamentos = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT p.*, a.servico, a.data_agendamento, c.nome as cliente_nome
            FROM pagamentos p
            JOIN agendamentos a ON p.agendamento_id = a.id
            JOIN clientes c ON a.cliente_id = c.id
            ORDER BY p.data_criacao DESC
        `)
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar pagamentos' })
    }
}

// Buscar pagamento por ID
exports.buscarPagamentoPorId = async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await pool.query(`
            SELECT p.*, a.servico, a.data_agendamento, c.nome as cliente_nome, c.email as cliente_email
            FROM pagamentos p
            JOIN agendamentos a ON p.agendamento_id = a.id
            JOIN clientes c ON a.cliente_id = c.id
            WHERE p.id = $1
        `, [id])
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Pagamento não encontrado' })
        }
        
        res.json(resultado.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar pagamento' })
    }
}

// Buscar pagamento por agendamento
exports.pagamentoPorAgendamento = async (req, res) => {
    try {
        const { agendamento_id } = req.params
        const resultado = await pool.query(
            'SELECT * FROM pagamentos WHERE agendamento_id = $1',
            [agendamento_id]
        )
        
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar pagamento' })
    }
}

// Criar novo pagamento
exports.criarPagamento = async (req, res) => {
    try {
        const { agendamento_id, valor, metodo_pagamento, descricao } = req.body
        
        // Validação básica
        if (!agendamento_id || !valor || !metodo_pagamento) {
            return res.status(400).json({ erro: 'Campo obrigatório faltando' })
        }
        
        // Verificar se agendamento existe
        const agendamento = await pool.query('SELECT id FROM agendamentos WHERE id = $1', [agendamento_id])
        if (agendamento.rows.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado' })
        }
        
        // Validar métodos de pagamento aceitos
        const metodosValidos = ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix']
        if (!metodosValidos.includes(metodo_pagamento)) {
            return res.status(400).json({ erro: 'Método de pagamento inválido' })
        }
        
        const resultado = await pool.query(
            'INSERT INTO pagamentos (agendamento_id, valor, metodo_pagamento, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
            [agendamento_id, valor, metodo_pagamento, descricao]
        )
        
        res.status(201).json({ 
            mensagem: 'Pagamento criado com sucesso',
            pagamento: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao criar pagamento' })
    }
}

// Confirmar pagamento
exports.confirmarPagamento = async (req, res) => {
    try {
        const { id } = req.params
        const { data_pagamento } = req.body
        
        const resultado = await pool.query(
            'UPDATE pagamentos SET status = $1, data_pagamento = COALESCE($2, CURRENT_TIMESTAMP) WHERE id = $3 RETURNING *',
            ['pago', data_pagamento, id]
        )
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Pagamento não encontrado' })
        }
        
        res.json({ 
            mensagem: 'Pagamento confirmado com sucesso',
            pagamento: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao confirmar pagamento' })
    }
}

// Cancelar pagamento
exports.cancelarPagamento = async (req, res) => {
    try {
        const { id } = req.params
        
        const resultado = await pool.query(
            'UPDATE pagamentos SET status = $1 WHERE id = $2 RETURNING *',
            ['reembolso', id]
        )
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Pagamento não encontrado' })
        }
        
        res.json({ 
            mensagem: 'Pagamento cancelado com sucesso',
            pagamento: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao cancelar pagamento' })
    }
}

// Listar pagamentos por status
exports.pagamentosPorStatus = async (req, res) => {
    try {
        const { status } = req.params
        const statusValidos = ['pendente', 'pago', 'cancelado', 'reembolso']
        
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ erro: 'Status inválido' })
        }
        
        const resultado = await pool.query(`
            SELECT p.*, a.servico, c.nome as cliente_nome
            FROM pagamentos p
            JOIN agendamentos a ON p.agendamento_id = a.id
            JOIN clientes c ON a.cliente_id = c.id
            WHERE p.status = $1
            ORDER BY p.data_criacao DESC
        `, [status])
        
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar pagamentos' })
    }
}

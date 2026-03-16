const pool = require('../db')


exports.listarAgendamentos = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT a.*, c.nome as cliente_nome, c.telefone as cliente_telefone, 
                   p.nome as profissional_nome, p.especialidade
            FROM agendamentos a
            JOIN clientes c ON a.cliente_id = c.id
            JOIN profissionais p ON a.profissional_id = p.id
            ORDER BY a.data_agendamento DESC
        `)
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar agendamentos' })
    }
}


exports.buscarAgendamentoPorId = async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await pool.query(`
            SELECT a.*, c.nome as cliente_nome, c.telefone as cliente_telefone, c.email as cliente_email,
                   p.nome as profissional_nome, p.especialidade
            FROM agendamentos a
            JOIN clientes c ON a.cliente_id = c.id
            JOIN profissionais p ON a.profissional_id = p.id
            WHERE a.id = $1
        `, [id])
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado' })
        }
        
        res.json(resultado.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar agendamento' })
    }
}


exports.agendamentosCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params
        const resultado = await pool.query(`
            SELECT a.*, p.nome as profissional_nome, p.especialidade
            FROM agendamentos a
            JOIN profissionais p ON a.profissional_id = p.id
            WHERE a.cliente_id = $1
            ORDER BY a.data_agendamento DESC
        `, [cliente_id])
        
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar agendamentos' })
    }
}


exports.agendamentosProfissional = async (req, res) => {
    try {
        const { profissional_id } = req.params
        const resultado = await pool.query(`
            SELECT a.*, c.nome as cliente_nome, c.telefone as cliente_telefone
            FROM agendamentos a
            JOIN clientes c ON a.cliente_id = c.id
            WHERE a.profissional_id = $1
            ORDER BY a.data_agendamento DESC
        `, [profissional_id])
        
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar agendamentos' })
    }
}


exports.criarAgendamento = async (req, res) => {
    try {
        const { cliente_id, profissional_id, data_agendamento, duracao_minutos, servico, observacoes } = req.body
        
        
        if (!cliente_id || !profissional_id || !data_agendamento || !servico) {
            return res.status(400).json({ erro: 'Campo obrigatório faltando' })
        }
        
       
        const cliente = await pool.query('SELECT id FROM clientes WHERE id = $1', [cliente_id])
        if (cliente.rows.length === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado' })
        }
        
        
        const profissional = await pool.query('SELECT id FROM profissionais WHERE id = $1', [profissional_id])
        if (profissional.rows.length === 0) {
            return res.status(404).json({ erro: 'Profissional não encontrado' })
        }
        
        const resultado = await pool.query(
            'INSERT INTO agendamentos (cliente_id, profissional_id, data_agendamento, duracao_minutos, servico, observacoes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [cliente_id, profissional_id, data_agendamento, duracao_minutos || 60, servico, observacoes]
        )
        
        res.status(201).json({ 
            mensagem: 'Agendamento criado com sucesso',
            agendamento: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao criar agendamento' })
    }
}


exports.atualizarAgendamento = async (req, res) => {
    try {
        const { id } = req.params
        const { data_agendamento, duracao_minutos, servico, observacoes, status } = req.body
        
        const resultado = await pool.query(
            'UPDATE agendamentos SET data_agendamento = COALESCE($1, data_agendamento), duracao_minutos = COALESCE($2, duracao_minutos), servico = COALESCE($3, servico), observacoes = COALESCE($4, observacoes), status = COALESCE($5, status) WHERE id = $6 RETURNING *',
            [data_agendamento, duracao_minutos, servico, observacoes, status, id]
        )
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado' })
        }
        
        res.json({ 
            mensagem: 'Agendamento atualizado com sucesso',
            agendamento: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao atualizar agendamento' })
    }
}


exports.cancelarAgendamento = async (req, res) => {
    try {
        const { id } = req.params
        
        const resultado = await pool.query(
            'UPDATE agendamentos SET status = $1 WHERE id = $2 RETURNING *',
            ['cancelado', id]
        )
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado' })
        }
        
        res.json({ 
            mensagem: 'Agendamento cancelado com sucesso',
            agendamento: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao cancelar agendamento' })
    }
}

const pool = require('../db')

exports.listarProfissionais = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM profissionais WHERE ativo = TRUE')
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar profissionais' })
    }
}

exports.buscarProfissionalPorId = async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await pool.query('SELECT * FROM profissionais WHERE id = $1', [id])
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Profissional não encontrado' })
        }
        
        res.json(resultado.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar profissional' })
    }
}

exports.buscarPorEspecialidade = async (req, res) => {
    try {
        const { especialidade } = req.params
        const resultado = await pool.query(
            'SELECT * FROM profissionais WHERE especialidade ILIKE $1 AND ativo = TRUE',
            [`%${especialidade}%`]
        )
        
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar profissionais' })
    }
}

exports.criarProfissional = async (req, res) => {
    try {
        const { nome, email, telefone, cpf, especialidade, descricao, foto_url } = req.body
        
        // Validação básica
        if (!nome || !email || !especialidade) {
            return res.status(400).json({ erro: 'Nome, email e especialidade são obrigatórios' })
        }
        
        const resultado = await pool.query(
            'INSERT INTO profissionais (nome, email, telefone, cpf, especialidade, descricao, foto_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nome, email, telefone, cpf, especialidade, descricao, foto_url]
        )
        
        res.status(201).json({ 
            mensagem: 'Profissional cadastrado com sucesso',
            profissional: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        if (error.code === '23505') { // Violação de constraint unique
            return res.status(400).json({ erro: 'Email ou CPF já cadastrado' })
        }
        res.status(500).json({ erro: 'Erro ao criar profissional' })
    }
}

exports.atualizarProfissional = async (req, res) => {
    try {
        const { id } = req.params
        const { nome, email, telefone, cpf, especialidade, descricao, foto_url } = req.body
        
        const resultado = await pool.query(
            'UPDATE profissionais SET nome = COALESCE($1, nome), email = COALESCE($2, email), telefone = COALESCE($3, telefone), cpf = COALESCE($4, cpf), especialidade = COALESCE($5, especialidade), descricao = COALESCE($6, descricao), foto_url = COALESCE($7, foto_url) WHERE id = $8 RETURNING *',
            [nome, email, telefone, cpf, especialidade, descricao, foto_url, id]
        )
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Profissional não encontrado' })
        }
        
        res.json({ 
            mensagem: 'Profissional atualizado com sucesso',
            profissional: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao atualizar profissional' })
    }
}

exports.deletarProfissional = async (req, res) => {
    try {
        const { id } = req.params
        
        const resultado = await pool.query(
            'UPDATE profissionais SET ativo = FALSE WHERE id = $1 RETURNING *',
            [id]
        )
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Profissional não encontrado' })
        }
        
        res.json({ mensagem: 'Profissional deletado com sucesso' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao deletar profissional' })
    }
}

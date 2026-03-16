

exports.listarClientes = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM clientes Where ativo = TRUE')
        res.json(resultado.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar clientes' })
    }
}

exports.buscarClientePorId = async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await pool.query("SELECT * FROM clientes WHERE id = $1", [id])
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado' })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao buscar cliente' })
    }
}
exports.criarCliente = async (req, res) => {
    try {
        console
        const { nome, email, telefone, cpf, endereco } = req.body
        if (!nome || !email || !telefone) {
            return res.status(400).json({ erro: 'Nome, email e telefone são obrigatórios' })
        }
        const resultado = await pool.query(
            'INSERT INTO clientes (nome, email, telefone, cpf, endereco) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [nome, email, telefone, cpf || null, endereco || null]
        )
        res.status(201).json({ mensagem: 'Cliente criado com sucesso', clienteId: resultado.rows[0].id })
    } catch (error) {
        console.error(error)
        if (error.code === '23505') {
            return res.status(400).json({ erro: 'Email ou CPF já cadastrado' })
        }
        res.status(500).json({ erro: 'Erro ao criar cliente' })
    }
}
    exports.atualizarCliente = async (req, res) => {
        try {
            const { id } = req.params
            const { nome, email, telefone, cpf, endereco } = req.body

            const resultado = await pool.query(
                'UPDATE clientes SET nome = COALESCE($1, nome), email = COALESCE($2, email), telefone = COALESCE($3, telefone), cpf = COALESCE($4, cpf), endereco = COALESCE($5, endereco) WHERE id = $6 RETURNING *',
                [nome, email, telefone, cpf, endereco, id]
            )

            if (resultado.rows.length === 0) {
                return res.status(404).json({ erro: 'Cliente não encontrado' })
            }

            res.json({
                mensagem: 'Cliente atualizado com sucesso',
                cliente: resultado.rows[0]
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ erro: 'Erro ao atualizar cliente' })
        }
    }
    exports.deletarCliente = async (req, res) => {
        try {
            const { id } = req.params

            const resultado = await pool.query(
                'UPDATE clientes SET ativo = FALSE WHERE id = $1 RETURNING *',
                [id]
            )

            if (resultado.rows.length === 0) {
                return res.status(404).json({ erro: 'Cliente não encontrado' })
            }

            res.json({ mensagem: 'Cliente deletado com sucesso' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ erro: 'Erro ao deletar cliente' })
        }
    }

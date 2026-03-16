const pool = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.registrar = async (req, res) => {
    try {
        const { nome, email, senha, tipo, telefone } = req.body
        
        if (!nome || !email || !senha || !telefone) {
<<<<<<< HEAD
            return res.status(400).json({ erro: 'Nome, email, senha e telefone são obrigatórios' })
=======
            return res.status(400).json({ erro: 'Nome, email, telefone e senha são obrigatórios' })
>>>>>>> 30bdd757d12a97357a0fc625eca32c8ff1612677
        }
        
        // Verificar se email já existe
        const usuarioExistente = await pool.query(
            'SELECT id FROM profissionais WHERE email = $1',
            [email]
        )
        
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ erro: 'Email já cadastrado' })
        }
        
        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10)
        
        // Inserir como profissional com tipo de usuário
        const resultado = await pool.query(
            'INSERT INTO profissionais (nome, email, telefone, especialidade) VALUES ($1, $2, $3, $4) RETURNING id, nome, email',
            [nome, email, telefone, tipo || 'admin']
        )
        
        res.status(201).json({ 
            mensagem: 'Usuário registrado com sucesso',
            usuario: resultado.rows[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao registrar usuário' })
    }
}

// Login de usuário
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body
        
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' })
        }
        
        // Buscar usuário
        const resultado = await pool.query(
            'SELECT * FROM profissionais WHERE email = $1',
            [email]
        )
        
        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Email ou senha inválidos' })
        }
        
        const usuario = resultado.rows[0]
        
 
        if (usuario.especialidade !== 'admin' && email !== 'admin@salao.com') {
            return res.status(401).json({ erro: 'Apenas administradores podem fazer login' })
        }
        
        // Gerar JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email,
                nome: usuario.nome
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        
        res.json({ 
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao fazer login' })
    }
}

// Middleware para verificar JWT
exports.verificarToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({ erro: 'Token não fornecido' })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = decoded
        next()
    } catch (error) {
        res.status(401).json({ erro: 'Token inválido ou expirado' })
    }
}

// Obter dados do usuário logado
exports.obterPerfil = (req, res) => {
    res.json({
        id: req.usuario.id,
        email: req.usuario.email,
        nome: req.usuario.nome
    })
}

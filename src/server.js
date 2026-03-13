require('dotenv').config()
const express = require("express")
const cors = require("cors")
const pool = require('./db')

// Importar controllers
const clienteController = require('./Controller/clienteController')
const profissionalController = require('./Controller/profissionalController')
const agendamentoController = require('./Controller/agendamentoController')
const pagamentoController = require('./Controller/pagamentoController')
const authController = require('./Controller/authController')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// ============== ROTAS DE AUTENTICAÇÃO ==============
app.post('/auth/login', authController.login)
app.post('/auth/perfil', authController.verificarToken, authController.obterPerfil)

// ============== ROTAS DE CLIENTES ==============
// GET - Listar todos os clientes
app.get('/clientes', clienteController.listarClientes)

// GET - Buscar cliente por ID
app.get('/clientes/:id', clienteController.buscarClientePorId)

// POST - Criar novo cliente
app.post('/clientes', clienteController.criarCliente)

// PUT - Atualizar cliente
app.put('/clientes/:id', clienteController.atualizarCliente)

// DELETE - Deletar cliente
app.delete('/clientes/:id', clienteController.deletarCliente)

// ============== ROTAS DE PROFISSIONAIS ==============
// GET - Listar todos os profissionais
app.get('/profissionais', profissionalController.listarProfissionais)

// GET - Buscar profissional por ID
app.get('/profissionais/:id', profissionalController.buscarProfissionalPorId)

// GET - Buscar profissionais por especialidade
app.get('/profissionais/especialidade/:especialidade', profissionalController.buscarPorEspecialidade)

// POST - Criar novo profissional
app.post('/profissionais', authController.verificarToken, profissionalController.criarProfissional)

// PUT - Atualizar profissional
app.put('/profissionais/:id', authController.verificarToken, profissionalController.atualizarProfissional)

// DELETE - Deletar profissional
app.delete('/profissionais/:id', authController.verificarToken, profissionalController.deletarProfissional)

// ============== ROTAS DE AGENDAMENTOS ==============
// GET - Listar todos os agendamentos
app.get('/agendamentos', agendamentoController.listarAgendamentos)

// GET - Buscar agendamento por ID
app.get('/agendamentos/:id', agendamentoController.buscarAgendamentoPorId)

// GET - Agendamentos de um cliente
app.get('/clientes/:cliente_id/agendamentos', agendamentoController.agendamentosCliente)

// GET - Agendamentos de um profissional
app.get('/profissionais/:profissional_id/agendamentos', agendamentoController.agendamentosProfissional)

// POST - Criar novo agendamento
app.post('/agendamentos', agendamentoController.criarAgendamento)

// PUT - Atualizar agendamento
app.put('/agendamentos/:id', agendamentoController.atualizarAgendamento)

// DELETE - Cancelar agendamento
app.delete('/agendamentos/:id', agendamentoController.cancelarAgendamento)

// ============== ROTAS DE PAGAMENTOS ==============
// GET - Listar todos os pagamentos
app.get('/pagamentos', pagamentoController.listarPagamentos)

// GET - Buscar pagamento por ID
app.get('/pagamentos/:id', pagamentoController.buscarPagamentoPorId)

// GET - Pagamentos por agendamento
app.get('/agendamentos/:agendamento_id/pagamentos', pagamentoController.pagamentoPorAgendamento)

// GET - Pagamentos por status
app.get('/pagamentos/status/:status', pagamentoController.pagamentosPorStatus)

// POST - Criar novo pagamento
app.post('/pagamentos', pagamentoController.criarPagamento)

// PUT - Confirmar pagamento
app.put('/pagamentos/:id/confirmar', pagamentoController.confirmarPagamento)

// PUT - Cancelar pagamento
app.put('/pagamentos/:id/cancelar', pagamentoController.cancelarPagamento)

// ============== ROTA DE TESTE ==============
app.get('/health', (req, res) => {
    res.json({ mensagem: 'Servidor funcionando corretamente!' })
})

// ============== TRATAMENTO DE ERROS ==============
app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' })
})

// Iniciar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`)
    console.log(`🗄️  Conectado ao banco de dados: ${process.env.DB_NAME}`)
    console.log(`📍 Acesso em http://localhost:${PORT}`)
})
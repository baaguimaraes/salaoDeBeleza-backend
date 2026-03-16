require('dotenv').config()
const express = require("express")
const cors = require("cors")
const pool = require('./db')


const clienteController = require('./Controller/cliente')
const profissionalController = require('./Controller/profissionais')
const agendamentoController = require('./Controller/agendamentoController')
const pagamentoController = require('./Controller/pagamentoController')
const authController = require('./Controller/authController')

const app = express()


app.use(cors())
app.use(express.json())
app.post('/auth/login', authController.login)
app.post('/auth/registar', authController.registrar)
app.post('/auth/perfil', authController.verificarToken, authController.obterPerfil)
app.get('/clientes', clienteController.listarClientes)
app.get('/clientes/:id', clienteController.buscarClientePorId)
app.post('/clientes', clienteController.criarCliente)
app.put('/clientes/:id', clienteController.atualizarCliente)
app.delete('/clientes/:id', clienteController.deletarCliente)
app.get('/profissionais', profissionalController.listarProfissionais)
app.get('/profissionais/:id', profissionalController.buscarProfissionalPorId)
app.get('/profissionais/especialidade/:especialidade', profissionalController.buscarPorEspecialidade)
app.post('/profissionais', authController.verificarToken, profissionalController.criarProfissional)
app.put('/profissionais/:id', authController.verificarToken, profissionalController.atualizarProfissional)
app.delete('/profissionais/:id', authController.verificarToken, profissionalController.deletarProfissional)
app.get('/agendamentos', agendamentoController.listarAgendamentos)
app.get('/agendamentos/:id', agendamentoController.buscarAgendamentoPorId)
app.get('/clientes/:cliente_id/agendamentos', agendamentoController.agendamentosCliente)
app.get('/profissionais/:profissional_id/agendamentos', agendamentoController.agendamentosProfissional)
app.post('/agendamentos', agendamentoController.criarAgendamento)
app.put('/agendamentos/:id', agendamentoController.atualizarAgendamento)
app.delete('/agendamentos/:id', agendamentoController.cancelarAgendamento)
app.get('/pagamentos', pagamentoController.listarPagamentos)
app.get('/pagamentos/:id', pagamentoController.buscarPagamentoPorId)
app.get('/agendamentos/:agendamento_id/pagamentos', pagamentoController.pagamentoPorAgendamento)
app.get('/pagamentos/status/:status', pagamentoController.pagamentosPorStatus)
app.post('/pagamentos', pagamentoController.criarPagamento)
app.put('/pagamentos/:id/confirmar', pagamentoController.confirmarPagamento)
app.put('/pagamentos/:id/cancelar', pagamentoController.cancelarPagamento)

app.get('/health', (req, res) => {
    res.json({ mensagem: 'Servidor funcionando corretamente!' })
})


app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`)
    console.log(`🗄️  Conectado ao banco de dados: Neon`)
    console.log(`📍 Acesso em http://localhost:${PORT}`)
})
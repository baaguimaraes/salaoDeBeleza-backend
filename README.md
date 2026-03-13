# 💇‍♀️ Salão de Beleza - Backend

Backend de um sistema de gerenciamento de salão de beleza com funcionalidades de cadastro de clientes, profissionais, agendamentos e pagamentos.

## 🎯 Funcionalidades

✅ **Cadastro de Clientes** - Registre clientes com dados completos
✅ **Cadastro de Profissionais** - Mantenha equipe com especialidades
✅ **Agendamentos** - Sistema completo de marcação de horários
✅ **Pagamentos** - Gestão de pagamentos com múltiplos métodos
✅ **Autenticação** - Proteção com JWT

## 🛠️ Principais Tecnologias

- **Node.js** + **Express** - Servidor web
- **PostgreSQL** - Banco de dados relacional  
- **JWT** - Autenticação segura
- **bcryptjs** - Criptografia de senhas
- **CORS** - Requisições cross-origin

## 📋 Pré-requisitos

- Node.js (v14+)
- PostgreSQL (v12+)
- npm ou yarn

## ⚙️ Instalação

1. **Clone o repositório**
   ```bash
   cd salaoDeBeleza-backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados PostgreSQL**
   - Crie um banco: `CREATE DATABASE salao_de_beleza;`
   - Execute o schema: `psql -U postgres -d salao_de_beleza -f src/schema.sql`

4. **Configure variáveis de ambiente**
   - Crie arquivo `.env` na raiz com:
   ```
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=salao_de_beleza
   JWT_SECRET=sua_chave_super_secreta
   PORT=3000
   ```

5. **Inicie o servidor**
   ```bash
   npm start        # produção
   npm run dev      # desenvolvimento
   ```

## 📚 Rotas Disponíveis

### 🔐 Autenticação
- `POST` `/auth/login` - Fazer login
- `POST` `/auth/perfil` - Obter perfil do usuário (requer token)

### 👥 Clientes
- `GET` `/clientes` - Listar todos
- `GET` `/clientes/:id` - Buscar por ID
- `POST` `/clientes` - Criar novo
- `PUT` `/clientes/:id` - Atualizar
- `DELETE` `/clientes/:id` - Deletar

### 💅 Profissionais  
- `GET` `/profissionais` - Listar todos
- `GET` `/profissionais/:id` - Buscar por ID
- `GET` `/profissionais/especialidade/:especialidade` - Buscar por especialidade
- `POST` `/profissionais` - Criar novo (requer autenticação)
- `PUT` `/profissionais/:id` - Atualizar (requer autenticação)
- `DELETE` `/profissionais/:id` - Deletar (requer autenticação)

### 📅 Agendamentos
- `GET` `/agendamentos` - Listar todos
- `GET` `/agendamentos/:id` - Buscar por ID
- `GET` `/clientes/:cliente_id/agendamentos` - Agendamentos de um cliente
- `GET` `/profissionais/:profissional_id/agendamentos` - Agendamentos de um profissional
- `POST` `/agendamentos` - Criar novo
- `PUT` `/agendamentos/:id` - Atualizar
- `DELETE` `/agendamentos/:id` - Cancelar

### 💳 Pagamentos
- `GET` `/pagamentos` - Listar todos
- `GET` `/pagamentos/:id` - Buscar por ID
- `GET` `/agendamentos/:agendamento_id/pagamentos` - Pagamentos de um agendamento
- `GET` `/pagamentos/status/:status` - Pagamentos por status
- `POST` `/pagamentos` - Criar novo
- `PUT` `/pagamentos/:id/confirmar` - Confirmar pagamento
- `PUT` `/pagamentos/:id/cancelar` - Cancelar pagamento

## 💡 Exemplos de Requisições

### Criar Cliente
```json
POST /clientes
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cpf": "123.456.789-00",
  "endereco": "Rua X, 123"
}
```

### Criar Profissional
```json
POST /profissionais
{
  "nome": "Maria Santos",
  "email": "maria@salao.com",
  "telefone": "(11) 88888-8888",
  "cpf": "987.654.321-00",
  "especialidade": "Manicure",
  "descricao": "Especialista em unhas"
}
```

### Criar Agendamento
```json
POST /agendamentos
{
  "cliente_id": 1,
  "profissional_id": 1,
  "data_agendamento": "2024-03-20 14:30:00",
  "duracao_minutos": 60,
  "servico": "Manicure e Pedicure",
  "observacoes": "Cliente tem alergia a alguns esmaltes"
}
```

### Criar Pagamento
```json
POST /pagamentos
{
  "agendamento_id": 1,
  "valor": 150.00,
  "metodo_pagamento": "cartao_credito",
  "descricao": "Pagamento do serviço"
}
```

## 📁 Estrutura do Projeto

```
salaoDeBeleza-backend/
├── src/
│   ├── server.js                 # Arquivo principal
│   ├── db.js                     # Configuração do banco
│   ├── schema.sql                # Estrutura do banco
│   ├── clienteController.js      # Lógica de clientes
│   ├── profissionalController.js # Lógica de profissionais
│   ├── agendamentoController.js  # Lógica de agendamentos
│   ├── pagamentoController.js    # Lógica de pagamentos
│   ├── authController.js         # Lógica de autenticação
│   └── package.json              # Dependências
├── .env                          # Variáveis de ambiente
└── README.md                     # Este arquivo
```

## 🚀 Próximos Passos

1. **Validação de Dados** - Implementar validação mais robusta
2. **Testes Automatizados** - Criar testes com Jest/Axios
3. **Frontend** - Desenvolver interface com React/Vue
4. **Autenticação Google** - Permitir login social
5. **Email** - Enviar confirmações de agendamento
6. **SMS** - Lembretes de agendamentos

## 📞 Endpoints de Teste

Teste a API usando Postman ou cURL:

```bash
# Health check
curl http://localhost:3000/health

# Listar clientes
curl http://localhost:3000/clientes

# Criar cliente
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test","telefone":"123456","email":"test@test.com"}'
```

## 📄 Licença

MIT

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para fazer um PR.

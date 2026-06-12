# FIPPConsórcio

Sistema Full Stack de Gestão de Consórcios desenvolvido para a disciplina de Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas.

O sistema permite a criação e administração de grupos de consórcio, gerenciamento de cotas, processamento de pagamentos via PIX, realização de assembleias e controle financeiro completo.

## Funcionalidades

### Usuários
- Cadastro de usuários
- Login e autenticação
- Gerenciamento de perfil
- Controle de acesso

### Consórcios
- Criação de consórcios
- Configuração de taxa administrativa
- Configuração de fundo de reserva
- Definição do valor do prêmio
- Controle de status do consórcio

### Cotas
- Compra de cotas
- Controle de participantes
- Gestão de cotas contempladas
- Controle de inadimplência

### Pagamentos
- Integração com AbacatePay
- Geração de PIX dinâmico
- QR Code para pagamento
- Webhook para confirmação automática
- Atualização automática dos saldos

### Assembleias
- Controle das assembleias mensais
- Sorteio automático das cotas contempladas
- Histórico de contemplações
- Controle do fundo do consórcio

### Financeiro
- Saldo do consórcio
- Saldo do administrador
- Histórico de movimentações
- Controle de créditos e débitos

## Tecnologias Utilizadas

### Front-end
- Next.js
- React
- Bootstrap
- Socket.IO Client

### Back-end
- Node.js
- Express
- Socket.IO
- JWT Authentication

### Banco de Dados
- MySQL

### Integrações
- AbacatePay
- Ngrok (Webhooks locais)

## Arquitetura

O projeto segue uma arquitetura em camadas:

```text
client/
 ├── app/
 ├── components/
 ├── services/

server/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── routes/
 ├── middlewares/
 └── docs/
```

## Modelo de Negócio

O sistema realiza automaticamente a divisão dos pagamentos recebidos:

- Taxa Administrativa → Saldo do Administrador
- Fundo de Reserva → Saldo do Consórcio
- Fundo do Prêmio → Saldo do Consórcio

Após a confirmação dos pagamentos, o administrador pode realizar a assembleia e sortear uma cota ainda não contemplada.

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seuusuario/fippconsorcio.git
```

### 2. Backend

```bash

npm install
npm start
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env` no backend:

```env
PORT=5000

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

ABACATEPAY_API_KEY=

FRONTEND_URL=http://localhost:3000
```

## Documentação da API

A documentação da API está disponível através do Swagger após iniciar o servidor.

```text
http://localhost:5000/docs
```

## Banco de Dados

O script de criação do banco de dados encontra-se no projeto:

```text
sql-consorcio-v2.sql
```

## Imagens do Sistema

/img

## Autor

Desenvolvido por [João vitor santos de lima fagundes]
Desenvolvido por [Breno batista]

Projeto acadêmico desenvolvido para o curso de Análise e Desenvolvimento de Sistemas.

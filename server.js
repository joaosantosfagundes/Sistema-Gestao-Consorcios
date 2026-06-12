import 'dotenv/config';

console.log('AbacatePay key carregada:', process.env.ABACATEPAY_API_KEY ? 'SIM' : 'NÃO');
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import usuarioRouter    from './routes/usuarioRoute.js';
import loginRouter      from './routes/loginRoute.js';
import consorcioRouter  from './routes/consorcioRoute.js';
import pagamentoRouter  from './routes/pagamentoRoute.js';
import cotaRouter       from './routes/cotaRoute.js';
import assRouter        from './routes/assembleiaRoute.js';
import financeiroRouter from './routes/financeiroRoute.js';

import swaggerUi    from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import cors         from 'cors';

import { createRequire } from 'module';
import { setIO }    from './utils/socketManager.js';
import socketInit   from './sockets/socket.js';

const require    = createRequire(import.meta.url);
const outputJson = require('./swagger-output.json');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(outputJson, {
    swaggerOptions: { withCredentials: true }
}));

app.use('/usuario',    usuarioRouter);
app.use('/login',      loginRouter);
app.use('/consorcio',  consorcioRouter);
app.use('/cota',       cotaRouter);
app.use('/pagamento',  pagamentoRouter);
app.use('/assembleia', assRouter);
app.use('/financeiro', financeiroRouter);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }
});

setIO(io);
socketInit(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação: http://localhost:${PORT}/docs`);
});

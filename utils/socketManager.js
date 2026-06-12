let io;

export function setIO(ioInstance) {
    io = ioInstance;
}

export function getIO() {
    return io;
}

export function notificarPagamentoConfirmado(cotaId, dados) {
    if (io) {
        console.log(` Notificando pagamento confirmado para cota ${cotaId}:`, dados);
        io.to(`cota:${cotaId}`).emit('pagamento:confirmado', {
            cotaId,
            ...dados
        });
    } else {
        console.warn(' Socket.io não está inicializado');
    }
}

export function notificarPixGerado(cotaId, pixData) {
    if (io) {
        console.log(` Notificando PIX gerado para cota ${cotaId}`);
        io.to(`cota:${cotaId}`).emit('pix:gerado', {
            cotaId,
            ...pixData
        });
    }
}

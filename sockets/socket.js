
export default function socketInit(io) {
    io.on('connection', (socket) => {
      console.log(' Cliente conectado:', socket.id);

      socket.on('disconnect', () => {
          console.log(' Cliente desconectado:', socket.id);
      });

      // Evento para receber notificações de pagamento
      socket.on('notificacoes:conectar', (cotaId) => {
          console.log(` Cliente ${socket.id} conectado à cota ${cotaId}`);
          socket.join(`cota:${cotaId}`);
      });

      socket.on('notificacoes:desconectar', (cotaId) => {
          console.log(` Cliente ${socket.id} desconectado da cota ${cotaId}`);
          socket.leave(`cota:${cotaId}`);
      });
    });
}

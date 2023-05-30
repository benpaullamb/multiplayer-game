import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const wsInstance = expressWs(app);

app.use(express.static(path.resolve(__dirname, '../frontend')));

app.ws('/', ws => {
  ws.on('message', messageString => {
    const message = JSON.parse(messageString);
    switch (message.type) {
      case 'log':
        handleLog(message.data);
        break;
      case 'move':
        handleMove(message.data);
        break;
      case 'register':
        handleRegister(message.data);
        break;
    }
  });
});

const broadcast = message => {
  const wss = wsInstance.getWss();
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

const handleLog = data => {
  console.log(data);
};

const players = [];

const handleRegister = playerId => {
  if (!players.some(player => player.id === playerId)) {
    players.push({
      id: playerId,
      x: 0,
      y: 0
    });
    broadcast(players);
  }
};

const handleMove = movingPlayer => {
  const player = players.find(player => player.id === movingPlayer.id);
  player.x = movingPlayer.x;
  player.y = movingPlayer.y;
  broadcast(players);
};

app.listen(8080);

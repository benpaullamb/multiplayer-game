import './index.css';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const MAX_WIDTH = canvas.width;
const MAX_HEIGHT = canvas.height;
const COLOURS = ['red', 'green'];

const playerId = Math.floor(Math.random() * 1000000);
let players = [];

const ws = new WebSocket('ws://192.168.0.101:8080');
ws.onopen = () => {
  register(playerId);
};
const sendMessage = (type, message) => {
  ws.send(JSON.stringify({ type, data: message }));
};
const log = message => {
  sendMessage('log', message);
};
const move = message => {
  sendMessage('move', message);
};
const register = playerId => {
  sendMessage('register', playerId);
};

ws.onmessage = ({ data: playersString }) => {
  players = JSON.parse(playersString);
};

function render() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 1000, 1000);
  players.forEach((player, i) => {
    ctx.fillStyle = COLOURS[i];
    ctx.fillRect(player.x, player.y, 10, 10);
  });

  requestAnimationFrame(render);
}

render();

const clamp = (number, min, max) => {
  return Math.max(Math.min(number, max), min);
};

document.addEventListener('touchmove', ({ touches }) => {
  const touch = touches.item(0);
  const updatedPlayer = {
    id: playerId,
    x: clamp(touch.clientX, 0, MAX_WIDTH - 10),
    y: clamp(touch.clientY, 0, MAX_HEIGHT - 10)
  };
  move(updatedPlayer);
});

document.addEventListener('mousemove', e => {
  const updatedPlayer = {
    id: playerId,
    x: clamp(e.offsetX, 0, MAX_WIDTH - 10),
    y: clamp(e.offsetY, 0, MAX_HEIGHT - 10)
  };
  console.log(players);
  move(updatedPlayer);
});

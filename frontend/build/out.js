(() => {
  // src/index.js
  var canvas = document.querySelector("#canvas");
  var ctx = canvas.getContext("2d");
  var MAX_WIDTH = canvas.width;
  var MAX_HEIGHT = canvas.height;
  var COLOURS = ["red", "green"];
  var playerId = Math.floor(Math.random() * 1e6);
  var players = [];
  var ws = new WebSocket("ws://192.168.0.101:8080");
  ws.onopen = () => {
    register(playerId);
  };
  var sendMessage = (type, message) => {
    ws.send(JSON.stringify({ type, data: message }));
  };
  var move = (message) => {
    sendMessage("move", message);
  };
  var register = (playerId2) => {
    sendMessage("register", playerId2);
  };
  ws.onmessage = ({ data: playersString }) => {
    players = JSON.parse(playersString);
  };
  function render() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1e3, 1e3);
    players.forEach((player, i) => {
      ctx.fillStyle = COLOURS[i];
      ctx.fillRect(player.x, player.y, 10, 10);
    });
    requestAnimationFrame(render);
  }
  render();
  var clamp = (number, min, max) => {
    return Math.max(Math.min(number, max), min);
  };
  document.addEventListener("touchmove", ({ touches }) => {
    const touch = touches.item(0);
    const updatedPlayer = {
      id: playerId,
      x: clamp(touch.clientX, 0, MAX_WIDTH - 10),
      y: clamp(touch.clientY, 0, MAX_HEIGHT - 10)
    };
    move(updatedPlayer);
  });
  document.addEventListener("mousemove", (e) => {
    const updatedPlayer = {
      id: playerId,
      x: clamp(e.offsetX, 0, MAX_WIDTH - 10),
      y: clamp(e.offsetY, 0, MAX_HEIGHT - 10)
    };
    console.log(players);
    move(updatedPlayer);
  });
})();

export default class Game {
  /**
   * Creates a game on the client side to manage / render the players / projectiles
   * @param {Object} socket The socket connected to the server.
   */
  constructor(socket) {
    this.socket = socket;
    this.players = [];
    this.bullets = [];
  }

  /**
   * Create the game enviorment / HTML canvas 
   */
  create(socket, canvasElement) {
    const c = canvasElement.getContext('2d');
    canvasElement.width = 1080;
    canvasElement.height = 720;

    const game = new Game(socket);
    game.init();
    return game;
  }

  /**
   * Initializes the game and sets the event handler for the server packets.
   */
  init() {
    this.socket.on('update', (data) => {
      this.recieveGameState(data);
    })
  }

  /**
   * Updates the state of the game client side and relays intents to the
   * server.
   */
  update() {

  }

  /**
   * Draws the state of the game onto the HTML5 canvas.
   */
  draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    // Draw Bullets 

    // Draw Players
    for (let id in players) {
      let player = players[id];
      c.beginPath();
      c.arc(player.x, player.y, 10, 0, Math.PI * 2);
      c.fillStyle = "red";
      c.fill();
      c.closePath();
    }
  }

  /**
   * Starts animation loop and update / draws content
   */
  run() {
    this.update();
    this.draw();
    console.log('test')
    window.requestAnimationFrame(run);
  }
}
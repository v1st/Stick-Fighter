export default class Game {
  /**
   * Creates a game on the client side to manage / render the players / projectiles
   * @param {Object} socket The socket connected to the server.
   * @param {Object} ctx The context element for the html canvas
   */
  constructor(socket, ctx) {
    this.socket = socket;
    this.ctx = ctx;
    this.players = [];
    this.bullets = [];
  }

  /**
   * Initializes the game and sets the event handler for the server packets.
   */
  init() {
    this.socket.on('update', (data) => {
      //this.receiveGameState(data);
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
    // Draw Bullets 

    // Draw Players
   
  }

  /**
   * Starts animation loop and update / draws content
   */
  run() {
    this.update();
    this.draw();
  }
}

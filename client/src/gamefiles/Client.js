// Client Actions
export default class Client {
  /**
   * Client side player data and input
   * @param {Object} socket The user socket connected to the server.
   */
  constructor(socket) {
    this.socket = socket
  }

  addNewPlayer() {
    let player = new Player();

    socket.emit('newplayer', player);
  }

  askNewPlayer() {
    this.socket.emit('newplayer');
  }

  removePlayer() {

  }
}

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
    let player = 

    this.socket.emit('new player', playerData);
  }

  askNewPlayer() {
    this.socket.emit('new player');
  }

  removePlayer() {

  }
}

const Player = require('./Player');
const Bullet = require('./Bullet');

export default class Game {
  constructor() {
    // Users connected to site
    this.clients = [];
    // Users connected that are current players
    this.players = [];
    // Entities spawned in game
    this.bullets = [];
  }

  /** 
   * Creates new player with name and id
   * @param {string} name - display name of user
   * @param {string} id - socket ID of client player
   */
  newPlayer(name, socket) {
    return;
  }

  /** 
   * Deletes player with id
   *  @param {string} id - socket ID of the player to remove.
   */
  removePlayer(id) {
    return;
  }

  // Updates the state of all the objects in the game.
  update() {

  }

  // Sends the state of the game to all the connected sockets
  sendState() {

  }
}
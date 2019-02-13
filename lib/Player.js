const Bullet = require('./Bullet');

const MAX_HEALTH = 100;

export default class Player {
  /**
   * @param {Object} position - position of the player.
   * @param {string} name - display name of the player.
   * @param {string} id - socket ID of the client associated with this player
   */
  constructor(position, name, id) {
    this.position = position;
    this.name = name;
    this.id = id;
    this.velocity = {
      dx: 0,
      dy: 0
    }
    this.health = MAX_HEALTH;
    this.kills = 0;
    this.deaths = 0;
  }

  /**
   * Returns a new Player object given a name and id.
   * @param {string} name The display name of the player.
   * @param {string} id The socket ID of the client associated with this
   *   player.
   * @return {Player}
   */
  generateNewPlayer() {

  }
  /** 
   * Updates this player given the the client's keyboard state and mouse angle
   * @param {Object} keyState - state of the keyboard
   * @param {Object} mouseState - state of the mouse
   */
  updateOnInput(keyState, mouseState) {

  }
  
  /**
   * Updates the player's position, this runs in the 60Hz server side loop
   */
  update() {

  }
}
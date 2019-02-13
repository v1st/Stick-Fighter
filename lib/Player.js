const Bullet = require('./Bullet');

export default class Player {
  /*
    @param {Array.<number>} position - position of the player.
    @param {string} name - display name of the player.
    @param {string} id - socket ID of the client associated with this player
  */
  constructor(position, name, id) {
    this.position = position;
    this.name = name;
    this.id = id;
  }

  
}
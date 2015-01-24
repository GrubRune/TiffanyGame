/**
 * The intro state of the game
 * Manages the intro animation sequences
 *
 * @author marc gruber
 */
var Phaser = require('Phaser');

module.exports = function(game) {

  var gameState = {};

  gameState.create = function () {
      this._introMessage = game.add.sprite(0, 0, 'intro');
      this._drone = game.add.sprite(0, 0, 'drone');

      this._drone.anchor.x = 0.5;
      this._drone.anchor.y = 0.5;

      this._drone.x = game.width*0.5;
      this._drone.y = 70;

      this.counter = 0;

      this.initY = this._drone.y;

      this._spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  };

  gameState.update = function () {
      if(this._spaceKey.isDown) {
          game.state.start('game');
      }

      this.counter += Math.PI*0.02;
      this._drone.y = this.initY + Math.sin(this.counter) * 10;
  };

    return gameState;
};

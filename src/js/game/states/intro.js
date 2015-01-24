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
      this._spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  };

  gameState.update = function () {
      if(this._spaceKey.isDown) {
          game.state.start('game');
      }
  };

    return gameState;
};

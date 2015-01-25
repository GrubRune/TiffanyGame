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

      this._clouds = [];
      this.NUM_CLOUDS = 20;

      for (var i = 0; i < this.NUM_CLOUDS; i++) {
          var cloud = game.add.sprite(118*i, 128, 'cloud');
          this._clouds.push(cloud);
      }

      this._drone = game.add.sprite(0, 0, 'droneSide');
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

      for (var i = 0; i < this._clouds.length; i++) {
          var cloud = this._clouds[i];
          cloud.x += 3.0;

          if(cloud.x >= 918) {
              cloud.x = -112;
          }
      }

      this.counter += Math.PI*0.02;
      this._drone.y = this.initY + Math.sin(this.counter) * 10;
  };

    return gameState;
};

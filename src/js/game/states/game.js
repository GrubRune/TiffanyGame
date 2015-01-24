var Character = require('../entities/Character');
var levels = require('../levels');
var Phaser = require('Phaser');

module.exports = function(game) {

  var gameState = {};

  var lastUpdate = Date.now();

  gameState.create = function () {
      game.add.sprite(0, 0, 'grid');
      this._child = new Character(game, levels.levelA);

      game.physics.startSystem(Phaser.Physics.ARCADE);
  };

   /**
   * Use this to update the gamestate
   */
  gameState.update = function () {
      var now = new Date().getTime();
      var delta = (now - (lastUpdate || now)) / 1000;
      lastUpdate = now;

      this._child.loop(delta);
  };

  return gameState;
};

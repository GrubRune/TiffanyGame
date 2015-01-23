var Character = require('../entities/Character');

module.exports = function(game) {

  var gameState = {};

  var lastUpdate = Date.now();

  gameState.create = function () {
    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    this._child = new Character(game);
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

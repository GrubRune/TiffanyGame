module.exports = function(game) {

  var preloader = {};

  preloader.preload = function () {
    game.load.image('logo', 'images/phaser.png#grunt-cache-bust');
    game.load.image('grid', 'images/gridBase.png#grunt-cache-bust');
    game.load.image('character', 'images/character.png#grunt-cache-bust');
    game.load.atlas( 'child', 'images/ahmed.png', 'images/ahmed.json');
  };

  preloader.create = function () {
    game.state.start('game');
  };

  return preloader;
};

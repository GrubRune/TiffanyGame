module.exports = function(game) {

  var preloader = {};

  preloader.preload = function () {
    game.load.image('logo', 'images/phaser.png#grunt-cache-bust');
    game.load.image('character', 'images/character.png#grunt-cache-bust');
  };

  preloader.create = function () {
    game.state.start('game');
  };

  return preloader;
};

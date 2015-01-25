module.exports = function(game) {

  var preloader = {};

  preloader.preload = function () {
    game.load.image('logo', 'images/phaser.png#grunt-cache-bust');
    game.load.image('grid', 'images/gridBase.png#grunt-cache-bust');
    game.load.image('character', 'images/character.png#grunt-cache-bust');
    game.load.image('message', 'images/message.png#grunt-cache-bust');
    game.load.image('intro', 'images/introScreen.png#grunt-cache-bust');
    game.load.image('base', 'images/Grid_Village.png#grunt-cache-bust');
    game.load.image('speechBubble', 'images/speechBubble.png#grunt-cache-bust');


    game.load.image('bomb', 'images/bomb.png#grunt-cache-bust');
    game.load.image('drone', 'images/drone.png#grunt-cache-bust');

    game.load.image('cloud', 'images/cloud.png#grunt-cache-bust');

    game.load.image('droneSide', 'images/droneImage.png#grunt-cache-bust');

    game.load.image('ahmedDead', 'images/ahmedDead.png#grunt-cache-bust');

    game.load.atlas( 'child', 'images/ahmed.png', 'images/ahmed.json');
    game.load.atlas( 'school', 'images/school.png', 'images/school.json');

    game.load.audio('explosion', 'audio/explosion.ogg');
    game.load.audio('steps', 'audio/steps.mp3');
    game.load.audio('bomb', 'audio/bomb.mp3');
    game.load.audio('drone', 'audio/droneSound.mp3');
  };

  preloader.create = function () {
    game.state.start('intro');
  };

  return preloader;
};

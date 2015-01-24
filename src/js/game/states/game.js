var Character = require('../entities/Character');
var levels = require('../levels');
var Phaser = require('Phaser');
var storage = require('../deadDataBase');

module.exports = function(game) {

  var gameState = {};

  var lastUpdate = Date.now();

  gameState.create = function () {
      game.stage.backgroundColor = '#FFFFFF';

      game.add.sprite(0, 0, 'grid');

      this._game = game;

      // Flash
      this._flashCounter = 0;
      this.flash = game.add.graphics(0, 0);
      this.flash.beginFill(0xFFFFFF);
      this.flash.drawRect(0, 0, this.game.width, this.game.height);
      this.flash.alpha = 0.0;

      this.message = game.add.sprite(0, 0, 'message');

      this._child = new Character(game, levels.levelA);
      this._child.deadSignal.add(this._onPlayerDeadSignal, this);

      this.sowMessage = false;
      this.doesFlash = false;

      this.gameOver = false;

      this._explosionAudio = game.add.audio('explosion');
      this._explosionAudio.addMarker('explode', 0, 1.0);

      this.waitToReset = Date.now();

      this._placeBodies();

      this.message.anchor.x = 0.5;
      this.message.anchor.y = 0.5;

      this.message.x = 400;
      this.message.y = 300;
      this.message.alpha = 0;

      game.physics.startSystem(Phaser.Physics.ARCADE);
  };

  gameState._placeBodies = function() {
      for (var i = 0; i < storage.map.length; i++) {
          var storageObject = storage.map[i];
          game.add.sprite(storageObject.dX*40, storageObject.dY*40, 'ahmedDead');
      }
  };

  gameState._onPlayerDeadSignal = function() {
      this.sowMessage = true;
      this.doesFlash = true;
      this._explosionAudio.play('explode');
  };

   /**
   * Use this to update the gamestate
   */
  gameState.update = function () {
      var now = new Date().getTime();
      var delta = (now - (lastUpdate || now)) / 1000;
      lastUpdate = now;

      if(this.sowMessage) {
          this.message.alpha += delta;
      }

      if(this.message.alpha >= 1.0) {
          this.message.alpha = 1.0;
          this.sowMessage = false;
      }

      if(this.doesFlash) {
          this._flashCounter += Math.PI * delta;
          this.flash.alpha = Math.sin(this._flashCounter);

          if(this._flashCounter >= Math.PI*0.5) {
               this.gameOver = true;
               this.doesFlash = false;
               this._flashCounter = 0;
               this.flash.alpha = 1;
               this.waitToReset = Date.now()+2000;
          }
      }

      if(Date.now() > this.waitToReset && this.gameOver) {
          this._game.state.start('game');
      }

      this._child.loop(delta);
  };

  return gameState;
};

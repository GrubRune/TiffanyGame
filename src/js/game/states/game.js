var Character = require('../entities/Character');
var levels = require('../levels');
var Phaser = require('Phaser');
var storage = require('../deadDataBase');
var Bomb = require('../entities/Bomb');
var Drone = require('../entities/Drone');

module.exports = function(game) {

  var gameState = {};

  var lastUpdate = Date.now();

  gameState.create = function () {
      game.stage.backgroundColor = '#00000';

      game.add.sprite(0, 0, 'base');


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

      this._drone = new Drone(game, levels.levelA);
      this._game._bomblist = [];

      this._school = game.add.sprite(0, 0, 'school');
      this._school.x = 40 * 18;
      this._school.y = 4;

      this._school.animations.add('schoolAnim', [0,1,2], 12, true, true);
      this._school.animations.play('schoolAnim');

      this.bomb = undefined;

      game.physics.startSystem(Phaser.Physics.ARCADE);
  };

  gameState._placeBodies = function() {
      for (var i = 0; i < storage.map.length; i++) {
          var storageObject = storage.map[i];
          game.add.sprite(storageObject.dX*40, storageObject.dY*40, 'ahmedDead');
      }
  };

  gameState._onPlayerDeadSignal = function() {
     this.instantiateBomb(this._drone.x , this._drone.y, this._child.x, this._child.y , this._drone.rotation );
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


      // Drone and bomb

      this._drone.loop(delta);

      // update all bomb in bomblist
      // add to remove list if at target
      var removeList = [];
      for(var i=0; i< this._game._bomblist.length; i++){

          this._game._bomblist[i].loop(delta);

          if(this._game._bomblist[i]._remove()){
              removeList.push(game._bomblist[i]);
          }
      }

      // remove inactive from bombList
      for(var t=0; t< removeList.length; t++){
          this._game._bomblist.splice(game._bomblist.indexOf(removeList[t]),1);
      }
  };

    gameState._onBombImpact = function() {
         this.sowMessage = true;
         this.doesFlash = true;

        if(typeof this.bomb !== 'undefined') {
            this.bomb.alpha = 0;
        }

         this._child._currentState = 6;
         this._explosionAudio.play('explode');
    };

    // instantiate a bomb and insert into update List
    gameState.instantiateBomb = function (startX, startY, targetX, targetY, rotation) {
        this.bomb = new Bomb(game, startX, startY, targetX, targetY, rotation);
        this.bomb.alpha = 1;
        this.bomb.bombSignal.add(this._onBombImpact, this);
        this._game._bomblist.push(this.bomb);
    };

  return gameState;
};

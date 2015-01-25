/**
 * Created with Sublime Text 2
 * User: simonKovatsch
 * Date: 23.01.15
 * Time: 21:06
 */

var Phaser = require('Phaser');

/**
 * Mole constructor
 * @param game
 * @constructor
 */
var Bomb = function Bomb(game, startX, startY, targetX, targetY, rotation) {
    Phaser.Sprite.call(this, game, 0, 0, 'bomb');
    this._sprite = game.add.existing(this);

    this.game = game;
    /**
     * Possible states of drone
     * @type {{FLY: number, EXPLODE: number, REMOVE: number}}
     * @private
     */
    this._state = {
        FLY: 0,
        EXPLODE: 1,
        REMOVE: 2,
        FLYSTRAIGHT: 3
    };

    /**
     * center anchor point
     * @type {number}
     * @private
     */
    this._sprite.pivot.x = this._sprite.width * .5;
    this._sprite.pivot.y = this._sprite.height * .5;

    /**
     * Movespeed px/sec
     * @type {number}
     * @private
     */
    this._moveSpeed = 10;
    this._currentState = this._state.FLYSTRAIGHT;
    this._minDistExplode = 10;

    /**
    * find movment
    */
    this._currentRotation = rotation;
    this._currntMoveDir = {
        x: 0, 
        y: 0
    };
    this._rotationSpeed = 8;
    this._lastRotDir = 1;
    this._minDistToTarget = 100;
    this._straightTimer = .2;

    // init start and End Position
    this._start = {
        x: 0, 
        y: 0
    };
    this._start.x = startX;
    this._start.y = startY;
    this._target = {
        x: 0, 
        y: 0
    };
    this._target.x = targetX;
    this._target.y = targetY;

    this._moveDir = {x:0, y:0};
    this._moveDir.x = this._target.x - this._start.x;
    this._moveDir.y = this._target.y - this._start.y;

    // normalize dir vector
    var length = Math.sqrt(this._moveDir.x * this._moveDir.x + this._moveDir.y * this._moveDir.y);
    this._moveDir.y /= length; 
    this._moveDir.x /= length;

    this.bombSignal = new Phaser.Signal();

    this._bombAudio = this.game.add.audio('bomb');
    this._bombAudio.addMarker('flyingBomb', 0, 1.0);

    this._initialize();

};

var p = Bomb.prototype = Object.create(Phaser.Sprite.prototype);
p.constructor = Bomb;

/**
 * Use this for initialisation
 * @private
 */
p._initialize = function () {

    this._setAtStartPosition();
};

/**
 * Looks up the players starting position
 * @private
 */
p._setAtStartPosition = function () {
    this._bombAudio.play('flyingBomb');

   this.x = this._start.x;
   this.y = this._start.y;

   this._currentRotation += Math.PI;
   this._currntMoveDir.x = Math.cos(this._currentRotation + Math.PI *0.5);
   this._currntMoveDir.y = Math.sin(this._currentRotation + Math.PI *0.5);

   this.rotation = this._currentRotation;
};

p._remove = function (){
    return (this._currentState === this._state.REMOVE);
}

/**
 * Use this to reset properties
 * @private
 */
p._reset = function () {
};

/**
 * Gameloop
 * @param delta
 */
p.loop = function (delta) {

    switch (this._currentState) {

        case this._state.FLYSTRAIGHT:

            this._straightTimer -= delta;

            if( this._straightTimer < 0 ){
                
                var relTargetX  =  this.x - this._target.x;
                var relTargetY  =  this.y - this._target.y;
                
                var distToTarget = Math.sqrt(relTargetX*relTargetX, relTargetY*relTargetY);
                
                if( distToTarget > this._minDistToTarget ){
                   this._currentState = this._state.FLY;
                }
                
            }

            this.x += this._moveSpeed * this._currntMoveDir.x;
            this.y += this._moveSpeed * this._currntMoveDir.y;

            this.rotation = this._currentRotation;

            break;

        case this._state.FLY:
            
            // calc new Direction            
            this._currentRotation += delta * this._rotationSpeed * this._lastRotDir;

            this._currntMoveDir.x = Math.sin(this._currentRotation);
            this._currntMoveDir.y = Math.cos(this._currentRotation);

            // 2d vector bomb to target
            var relTargetX  =  this.x - this._target.x;
            var relTargetY  =  this.y - this._target.y;

            var xxx = Math.sin(this._currentRotation+Math.PI*0.5);
            var yyy = Math.cos(this._currentRotation+Math.PI*0.5);

            // forwar 2d Vec
            length = Math.sqrt(xxx *xxx + yyy * yyy);
            xxx /= length; 
            yyy /= length;

            var d = (xxx * relTargetX) + (yyy * relTargetY);
            
            // Move and rotate Sprite
            this.x += this._moveSpeed * this._currntMoveDir.x;
            this.y += this._moveSpeed * this._currntMoveDir.y;

            this.rotation = -this._currentRotation;

            if(d < 1){
                this._lastRotDir = 1;
            }else{
                this._lastRotDir = -1;
            }

            if(Math.abs(this.x-this._target.x) < this._minDistExplode && Math.abs(this.y-this._target.y) < this._minDistExplode){
                this._currentState = this._state.EXPLODE;
            }
            break;

        case this._state.EXPLODE:
            this.bombSignal.dispatch();
            this._currentState = this._state.REMOVE;
            break;

         case this._state.REMOVE:
            break;
    }
};

module.exports = Bomb;









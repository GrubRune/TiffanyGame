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
var Drone = function Drone(game, map) {
    Phaser.Sprite.call(this, game, 0, 0, 'drone');
    this._sprite = game.add.existing(this);

    this.game = game;
    /**
     * Possible states of drone
     * @type {{IDLE: number, FLY: number, SHOOT: number}}
     * @private
     */
    this._state = {
        IDLE: 0,
        FLY: 1,
        SHOOT: 2
    };

    this._curPosition = {
        x: 0,
        y: 0
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
    this._moveSpeed = 20;
    this._angle = 0;
    this._rotationSpeed = 20;
    this._moveDirection = {
        x: 0,
        y: 0
    };
    this._flyRadius = 300;

    this._doRandomShoot = false;
    this._randomShootEverySecend = 1;
    this._randomShootTimer = 2;
    

    this._map = map;
    this._mapSize = {
        x: 800,
        y: 600
    };

    this._currentState = this._state.IDLE;

    this._initialize();
};

var p = Drone.prototype = Object.create(Phaser.Sprite.prototype);
p.constructor = Drone;

/**
 * Use this for initialisation
 * @private
 */
p._initialize = function () {

    this._findStart();
};

/**
 * Looks up the players starting position
 * @private
 */
p._findStart = function () {
   this.x = this._mapSize.x * 0.5;
   this.y = this._mapSize.y * 0.5;
};


p._pickRandomShootTarget = function () {
    
    var xRandomIndex =  Math.floor( Math.random() * this._map.tiles[0].length);
    var yRandomIndex =  Math.floor( Math.random() * this._map.tiles.length);

    return { x: (xRandomIndex * this._map.tileSize), y: (yRandomIndex * this._map.tileSize)};
    return { x: 400, y: 300};
};

/**
 * Shoot at Postion
 * @private
 */
p._shoot = function (target) {
    
    this.game.instantiateBomb( this.x, this.y, target.x, target.y, this.rotation);
};

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

        case this._state.IDLE:
            this._currentState = this._state.FLY;
            break;

        case this._state.FLY:
            
            if(this._doRandomShoot){
                // update Timer
                this._randomShootTimer += delta;
                if(this._randomShootTimer >= this._randomShootEverySecend){
                    this._shoot(this._pickRandomShootTarget());
                    // reset timer
                    this._randomShootTimer = 0;
                }
            }

            this._angle += delta * this._rotationSpeed;

            // calculate direction
            this.x = this._mapSize.x * 0.5 + Math.sin(this._angle * Math.PI / 180) * this._flyRadius;
            this.y = this._mapSize.y * 0.5 + Math.cos(this._angle * Math.PI / 180) * this._flyRadius;

            // calculate angle rad to deg
            this.rotation = -this._angle * (Math.PI / 180) + Math.PI*0.5;

            break;
        case this._state.SHOOT:
            break;
    }
};

module.exports = Drone;









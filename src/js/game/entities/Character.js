/**
 * Created with PhpStorm.
 * User: marcgruber
 * Date: 23.01.15
 * Time: 21:06
 */

var Phaser = require('Phaser');
var storage = require('../deadDataBase');

/**
 * Mole constructor
 * @param game
 * @constructor
 */
var Character = function Character(game, map) {
    Phaser.Sprite.call(this, game, 0, 0, 'child');
    game.add.existing(this);

    this.game = game;
    /**
     * Possible states of character
     * @type {{IDLE: number, WALK: number}}
     * @private
     */
    this._state = {
        IDLE: 0,
        WALK: 1,
        DEAD: 2,
        WIN: 3,
        ZOOM: 4
    };

    this._curTile = {
        x: 0,
        y: 0
    };

    this._nextTile = {
        x: 0,
        y: 0
    };

    this._dir = {
        x: 0,
        y: 0
    };

    /**
     * Movespeed px/sec
     * @type {number}
     * @private
     */
    this._moveSpeed = 400;

    this._zoomCounter = 0;

    this._map = map;
    this._mapSize = map.tileSize;
    this.isOnTile = false;

    this._upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this._downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    this.isMoving = false;

    this._currentState = this._state.IDLE;

    this._initialize();
};

var p = Character.prototype = Object.create(Phaser.Sprite.prototype);
p.constructor = Character;

/**
 * Use this for initialisation
 * @private
 */
p._initialize = function () {

    // Setup mole graphic
    this.animations.add('left', [1], 10, true, true);
    this.animations.add('right', [2], 10, true, true);
    this.animations.add('front', [3], 10, true, true);
    this.animations.add('back', [0], 10, true, true);
    this.animations.add('dead', [5], 10, true, true);

    this.animations.play('front');

    this._curTile = {
        x: 0,
        y: 0
    };

    this._nextTile = {
        x: 0,
        y: 0
    };

    this._dir = {
        x: 0,
        y: 0
    };

    this._zoomCounter = 0;

    this.deadSignal = new Phaser.Signal();

    this.game.world.setBounds(0, 0, 1920, 1920);

    this._findStart();
};

/**
 * Looks up the players starting position
 * @private
 */
p._findStart = function () {
    for (var i = 0; i < this._map.tiles.length; i++) {
        for (var j = 0; j < this._map.tiles[i].length; j++) {

            var tile = this._map.tiles[i][j];
            var x = j * this._mapSize;
            var y = i * this._mapSize;

            // starting position
            if (tile === 9) {
                this.x = x;
                this.y = y;
                // X position
                this._curTile.x = j;
                // Y position
                this._curTile.y = i;

                this.isOnTile = true;
            }
        }
    }
};

p._checkField = function () {
    var nextY = this._curTile.y;
    var nextX = this._curTile.x;

    var storedDir = {x:0, y:0};
    storedDir.x = this._dir.x;
    storedDir.y = this._dir.y;

    // UP Movement
    if (this._upKey.isDown && this.isOnTile || this._upKey.isDown && this._dir.y > 0) {
        this._dir.y = -1;

        nextY = this._curTile.y - 1;

        // Reverses direction
        if (this._dir.y > 0) {
            nextY = this._curTile.y;
        }

        nextY = nextY < 0 ? 0 : nextY;

        if (nextY > 0 && this._map.tiles[nextY][this._curTile.x] !== 1) {
            this._nextTile.y = nextY;
            this._dir.y = -1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
        }

        if(this._map.tiles[nextY][this._curTile.x] === 8) {
            this._currentState = this._state.WIN;
        }
    }

    // DOWN Movement
    if (this._downKey.isDown && this.isOnTile || this._downKey.isDown && this._dir.y < 0) {
        this._dir.y = 1;

        nextY = this._curTile.y + 1;

        // Reverse direction
        if (this._dir.y < 0) {
            nextY = this._curTile.y;
        }

        nextY = nextY > this._map.height - 1 ? this._map.height - 1 : nextY;

        if (nextY < this._map.height * this._mapSize && this._map.tiles[nextY][this._curTile.x] !== 1) {
            this._nextTile.y = nextY;
            this._dir.y = 1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
        }

        if(this._map.tiles[this._curTile.y][nextX] === 8) {
            this._currentState = this._state.WIN;
        }
    }

    // LEFT Movement
    if (this._leftKey.isDown && this.isOnTile || this._leftKey.isDown && this._dir.x > 0) {
        this._dir.x = -1;

        nextX = this._curTile.x - 1;

        // if we are right next
        if (this._dir.x > 0) {
            nextX = this._curTile.x;
        }

        nextX = nextX < 0 ? 0 : nextX;

        if (nextX >= 0 && this._map.tiles[this._curTile.y][nextX] !== 1) {
            this._nextTile.x = nextX;
            this._dir.x = -1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
        }

        if(this._map.tiles[this._curTile.y][nextX] === 8) {
            this._currentState = this._state.WIN;
        }
    }

    // RIGHT Movement
    if (this._rightKey.isDown && this.isOnTile || this._rightKey.isDown && this._dir.x < 0) {
        this._dir.x = 1;

        nextX = this._curTile.x + 1;

        // if we are left next
        if (this._dir.x < 0) {
            nextX = this._curTile.x;
        }

        nextX = nextX > this._map.width - 1 ? this._map.width - 1 : nextX;

        if (nextX < this._map.width * this._mapSize && this._map.tiles[this._curTile.y][nextX] !== 1) {
            this._nextTile.x = nextX;
            this._dir.x = 1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
        }
    }
};

/**
 * Use this to reset properties
 * @private
 */
p._reset = function () {
};

/**
 * Ceck if ahmed is dead
 * @param y
 * @param x
 * @private
 */
p._checkDead = function (y,x) {

    if( this._map.tiles[y][x] === 6 ) {
        var d = {dX:x, dY:y};
        storage.map.push(d);
        this._currentState = this._state.DEAD;
        console.log('dead: ' + this._currentState);

    }

   if( this._map.tiles[y][x] === 8 ) {
        this._currentState = this._state.WIN;
   }
};

p.startZoom = function() {
    this._currentState = this._state.ZOOM;
};

/**
 * Gameloop
 * @param delta
 */
p.loop = function (delta) {

    if(this._currentState !== this._state.DEAD &&
        this._currentState !== this._state.WIN &&
        this._currentState !== this._state.ZOOM)
    {
        this._checkField();
    }

    switch (this._currentState) {
        case this._state.IDLE:
            break;
        case this._state.WALK:

            this.y += this._moveSpeed * this._dir.y * delta;
            this.x += this._moveSpeed * this._dir.x * delta;

            // up movement
            if (this._dir.y < 0) {
                this.animations.play('back');

                if (this.y <= this._nextTile.y * this._mapSize) {
                    this.y = this._nextTile.y * this._mapSize;
                    this._curTile.y = this._nextTile.y;
                    this.isOnTile = true;
                    this._dir.y = 0;
                    this._currentState = this._state.IDLE;
                    this._checkDead(this._curTile.y , this._curTile.x);
                }
            }

            // down movement
            if (this._dir.y > 0) {
                this.animations.play('front');

                if (this.y >= this._nextTile.y * this._mapSize) {
                    this.y = this._nextTile.y * this._mapSize;
                    this._curTile.y = this._nextTile.y;
                    this.isOnTile = true;
                    this._dir.y = 0;
                    this._currentState = this._state.IDLE;
                    this._checkDead(this._curTile.y , this._curTile.x);
                }
            }

            // left movement
            if (this._dir.x < 0) {
                this.animations.play('left');

                if (this.x <= this._nextTile.x * this._mapSize) {
                    this.x = this._nextTile.x * this._mapSize;
                    this._curTile.x = this._nextTile.x;
                    this.isOnTile = true;
                    this._dir.x = 0;
                    this._currentState = this._state.IDLE;
                    this._checkDead(this._curTile.y , this._curTile.x);
                }
            }

            // left movement
            if (this._dir.x > 0) {
                this.animations.play('right');

                if (this.x >= this._nextTile.x * this._mapSize) {
                    this.x = this._nextTile.x * this._mapSize;
                    this._curTile.x = this._nextTile.x;
                    this.isOnTile = true;
                    this._dir.x = 0;
                    this._currentState = this._state.IDLE;
                    this._checkDead(this._curTile.y , this._curTile.x);
                }
            }

            break;
        case this._state.DEAD:
            this.animations.play('dead');
            this.deadSignal.dispatch();
            this._currentState = this._state.WIN;
            break;
        case this._state.WIN:
            break;
        case this._state.ZOOM:
            this.game.physics.arcade.enable(this);

            // this.game.states.load('game');
            this.game.camera.follow(this.body);

            this._zoomCounter += (Math.PI/1000) * delta;

            if( this._zoomCounter < Math.PI*0.5) {
                this.game.camera.scale.x +=  Math.sin(this._zoomCounter);
                this.game.camera.scale.y +=  Math.sin(this._zoomCounter);
            }

            if(this.game.camera.scale.x >= 3) {
                this.game.camera.scale.x = 3;
                this.game.camera.scale.y = 3;
            }
            break;
    }
};

module.exports = Character;
/**
 * Created with PhpStorm.
 * User: marcgruber
 * Date: 23.01.15
 * Time: 21:06
 */

var Phaser = require('Phaser');

/**
 * Mole constructor
 * @param game
 * @constructor
 */
var Character = function Character(game, map) {
    Phaser.Sprite.call(this, game, 0, 0, 'character');
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
        DEAD: 2
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

    this._isVerticallyMoving = false;
    this._isHorizontallyMoving = false;

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

/**
 * Input of character
 * @private
 */
p._input = function () {

    this._currentState = this._state.WALK;
};

p._checkField = function () {
    var nextY = this._curTile.y;
    var nextX = this._curTile.x;

    // UP Movement
    if (this._upKey.isDown && this.isOnTile || this._upKey.isDown && this._dir.y > 0) {

        if(this._dir.x !== 0) {
            return;
        }

        nextY = this._curTile.y - 1;

        // Reverses direction
        if(this._dir.y > 0 ) {
            nextY = this._curTile.y;
        }

        nextY = nextY < 0 ? 0 : nextY;

        if(this._map.tiles[nextY][this._curTile.x] === 1) {
            return;
        }

        if (nextY > 0 || this._map.tiles[nextY][this._curTile.x] !== 1) {
            this._nextTile.y = nextY;
            this._dir.y = -1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
            this._isVerticallyMoving = false;

        }
    }

    // DOWN Movement
    if (this._downKey.isDown && this.isOnTile || this._downKey.isDown && this._dir.y < 0 ) {

        if(this._dir.x !== 0) {
            return;
        }

        nextY = this._curTile.y + 1;

        // Reverse direction
        if(this._dir.y < 0) {
            nextY = this._curTile.y;
        }

        nextY = nextY > this._map.height -1 ? this._map.height -1 : nextY;

        if(this._map.tiles[nextY][this._curTile.x] === 1) {
            return;
        }

        if (nextY < this._map.height * this._mapSize || this._map[nextY][this._curTile.x] !== 1) {
            this._nextTile.y = nextY;
            this._dir.y = 1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
            this._isVerticallyMoving = false;
        }
    }

    // LEFT Movement
    if (this._leftKey.isDown && this.isOnTile || this._leftKey.isDown && this._dir.x > 0) {

        if(this._dir.y !== 0) {
            return;
        }

        nextX = this._curTile.x - 1;

        // if we are right next
        if(this._dir.x > 0) {
            nextX = this._curTile.x;
        }

        nextX = nextX < 0 ? 0 : nextX;

        if(this._map.tiles[this._curTile.y][nextX] === 1) {
            return;
        }

        if (nextX >= 0 || this._map[nextX][this._curTile.y] !== 1) {
            this._nextTile.x = nextX;
            this._dir.x = -1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
            this._isHorizontallyMoving = false;
        }
    }

    // RIGHT Movement
    if (this._rightKey.isDown && this.isOnTile || this._rightKey.isDown && this._dir.x < 0) {

        if(this._dir.y !== 0) {
            return;
        }

        nextX = this._curTile.x + 1;

        // if we are right next
        if(this._dir.x < 0) {
            nextX = this._curTile.x;
        }

        nextX = nextX > this._map.width-1 ? this._map.width-1 : nextX;

        if(this._map.tiles[this._curTile.y][nextX] === 1) {
            return;
        }

        if (nextX < this._map.width * this._mapSize || this._map[nextX][this._curTile.y] !== 1) {
            this._nextTile.x = nextX;
            this._dir.x = 1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
            this._isHorizontallyMoving = false;
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
 * Gameloop
 * @param delta
 */
p.loop = function (delta) {

    this._checkField();

    switch (this._currentState) {
        case this._state.IDLE:
            break;
        case this._state.WALK:
            this.y += this._moveSpeed * this._dir.y * delta;
            this.x += this._moveSpeed * this._dir.x * delta;

            // up movement
            if (this._dir.y < 0) {
                if (this.y <= this._nextTile.y * this._mapSize) {
                    this.y = this._nextTile.y * this._mapSize;
                    this._curTile.y = this._nextTile.y;
                    this.isOnTile = true;
                    this._dir.y = 0;
                }
            }

            // down movement
            if (this._dir.y > 0) {
                if (this.y >= this._nextTile.y * this._mapSize) {
                    this.y = this._nextTile.y * this._mapSize;
                    this._curTile.y = this._nextTile.y;
                    this.isOnTile = true;
                    this._dir.y = 0;
                }
            }

            // left movement
            if (this._dir.x < 0) {
                if (this.x <= this._nextTile.x * this._mapSize) {
                    this.x = this._nextTile.x * this._mapSize;
                    this._curTile.x = this._nextTile.x;
                    this.isOnTile = true;
                    this._dir.x = 0;
                }
            }

            // left movement
            if (this._dir.x > 0) {
                if (this.x >= this._nextTile.x * this._mapSize) {
                    this.x = this._nextTile.x * this._mapSize;
                    this._curTile.x = this._nextTile.x;
                    this.isOnTile = true;
                    this._dir.x = 0;
                }
            }


            break;
        case this._state.DEAD:
            break;
    }
};

module.exports = Character;
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
    this._moveSpeed = 20;

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

    console.log('dir: ' + this._dir.y);

    // char wants to move up
    if (this._upKey.isDown && this.isOnTile || this._upKey.isDown && this._dir.y > 0) {
        nextY = this._curTile.y - 1;
        if (nextY >= 0 || this._map[nextY][this._curTile.x] !== 1) {
            this._nextTile.y = nextY;
            this._dir.y = -1;
            this.isOnTile = false;
            this._currentState = this._state.WALK;
        }
    }

    if (this._downKey.isDown && this.isOnTile || this._downKey.isDown && this._dir.y < 0) {
        nextY = this._curTile.y + 1;

        if (nextY < this._map.height * this._mapSize || this._map[nextY][this._curTile.x] !== 1) {
            this._nextTile.y = nextY;
            this._dir.y = 1;
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
                }
            }

            // down movement
            if (this._dir.y > 0) {

                if (this.y >= this._nextTile.y * this._mapSize) {
                    this.y = this._nextTile.y * this._mapSize;
                    this._curTile.y = this._nextTile.y;
                    this.isOnTile = true;
                }
            }

            break;
        case this._state.DEAD:
            break;
    }
};

module.exports = Character;
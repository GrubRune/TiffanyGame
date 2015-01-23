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
var Character = function Character(game) {
    Phaser.Sprite.call(this, game, 0, 0, '');
    game.add.existing(this);

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
};

/**
 * Use this to reset properties
 * @private
 */
p._reset = function() {
};

/**
 * Marc rocks function
 * @private
 */
p._myFunction = function() {
    console.log('marc rockt');
};

/**
 * Gameloop
 * @param delta
 */
p.loop = function (delta) {
    console.log(delta);
    
    switch (this._currentState) {
        case this._state.IDLE:
            this._myFunction();
            break;
        case this._state.WALK:
            break;
        case this._state.DEAD:
            break;
    }
};

module.exports = Character;
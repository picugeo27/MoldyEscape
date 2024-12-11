import Phaser from "../lib/phaser.js";
import { DIRECTION } from "../types/typedef.js";

export class InputManager{
    // es el que se encarga de manejar el input de verdad
    #cursorKeys;    
    #inputLock;

    //Campos privados donde se guardan las teclas WASD
    #keyW;
    #keyA;
    #keyS;
    #keyD;
    #keyG;
    #keyM;
    #keyE;

    //Booleanos para comprobar si las teclas estan pulsadas o no
    _up;
    _down;
    _left;
    _right;
    _WUp;
    _ALeft;
    _SDown;
    _DRight;
    _GTurboEnemy;
    _MTurboPlayer;
    _trapKey;

    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene){
        this.reset();
        //Flechas de cursor para Player
        this.#cursorKeys = scene.input.keyboard.createCursorKeys() // createCursorKeys es metodo de Phaser para gestionar el input (por defecto coge flechas)
        //WASD para Enemy
        this.#keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.#keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.#keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.#keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        //Tecla para turbo del Player
        this.#keyM = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.#keyG = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        
        this.#keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);


    }

    set lockInput(val){    // sirve para evitar que se mueva algo, creo que nos sera util
        this.#inputLock = val;
    }

    update(){
        if (this.#inputLock){   // aqui bloqueamos el movimiento
            this.reset();
            return;
        }
        
        this.checkPlayerKeys();
        this.checkEnemyKeys();
        this.checkTurboKeyEnemy();
        this.checkTurboKeyPlayer();
        this._trapKey = this.#keyE.isDown;
    }

    checkPlayerKeys(){
        this._up = this.#cursorKeys.up.isDown;
        this._down = this.#cursorKeys.down.isDown;
        this._left = this.#cursorKeys.left.isDown;
        this._right = this.#cursorKeys.right.isDown;
    }

    checkEnemyKeys(){
        this._WUp = this.#keyW.isDown;
        this._ALeft = this.#keyA.isDown;
        this._SDown = this.#keyS.isDown;
        this._DRight = this.#keyD.isDown;
    }

    isMovingKeyPressedPlayer(){
        return (this._up | this._down | this._left | this._right)
    }

    isMovingKeyPressedEnemy(){
        return(this._WUp | this._ALeft | this._SDown | this._DRight)
    }

    checkTurboKeyEnemy(){
        this._GTurboEnemy = this.#keyG.isDown;
    }

    isTurboKeyEnemyPressed(){
        return this._GTurboEnemy;
    }

    checkTurboKeyPlayer(){
        this._MTurboPlayer = this.#keyM.isDown;
    }

    isTurboKeyPlayerPressed(){
        return this._MTurboPlayer;
    }

    isTrapPressed(){
        return this._trapKey;
    }

    getDirectionPlayer(){
        if (this._up)
            return DIRECTION.UP;
        else if (this._down)
            return DIRECTION.DOWN;
        else if (this._left)
            return DIRECTION.LEFT;
        else if (this._right) 
            return DIRECTION.RIGHT
    }

    getDirectionEnemy(){
        if (this._WUp)
            return DIRECTION.UP;
        else if (this._SDown)
            return DIRECTION.DOWN;
        else if (this._ALeft)
            return DIRECTION.LEFT;
        else if (this._DRight) 
            return DIRECTION.RIGHT
    }


    reset(){
        this._up = false;
        this._down = false;
        this._left = false;
        this._right = false;
        this._WUp = false;
        this._ALeft = false;
        this._SDown = false;
        this._DRight = false;
        this._trapKey = false;
    }

}
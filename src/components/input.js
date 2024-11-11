export class Input{

    // Esto es una clase para el imput (patron command de iv uwu)
    // las variables estan como _ porque asi las declaramos como privadas
    // en iv, aunque aqui creo que son privadas de mentira, pero para nosotros

    _up;
    _down;
    _left;
    _right;
    _special;

    constructor(){
        this.reset();
    }

    // getters para ver si estan pulsadas o no

    get upDown(){
        return this._up;
    }
    get downDown(){
        return this._down;
    }
    get leftDown(){
        return this._left;
    }
    get rightDown(){
        return this._right;
    }
    get specialDown(){
        return this._special;
    }

    // reset para marcar todas a false, suele ser util
    reset(){
        this._up = false;
        this._down = false;
        this._left = false;
        this._right = false;
        this._special = false;
    }
}
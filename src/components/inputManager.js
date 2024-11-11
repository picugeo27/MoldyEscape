import { Input } from "./input.js";
import Phaser from "../lib/phaser.js";

export class InputManager extends Input{
    // es el que se encarga de manejar el input de verdad
    #cursorKeys;    
    #inputLock;

    // aqui se añadiran los controles del otro jugador
    // se haria añadiendo parametros para que se asignen al up down y tal, y en funcion de eso ponemos que funcione
    // y en el update se cambiaria algo para eso
    
    constructor(scene){
        super();
        // el if es para asegurarme que es una scene lo que se recibe
        // me gustaria hacer un scene: Phaser.Scene pero no puedo con esta kk

        if (scene instanceof Phaser.Scene){
            this.#cursorKeys = scene.input.keyboard.createCursorKeys() // createCursorKeys es metodo de Phaser para gestionar el input (por defecto coge flechas)
            console.log("Se crea el manager del input")
        }
        else throw new Error("No recibe un scene");
    }
    set lockInput(val){    // sirve para evitar que se mueva algo, creo que nos sera util
        this.#inputLock = val;
    }

    update(){
        if (this.#inputLock){   // aqui bloqueamos el movimiento
            this.reset();
            return;
        }
        this._up = this.#cursorKeys.up.isDown;
        this._down = this.#cursorKeys.down.isDown;
        this._left = this.#cursorKeys.left.isDown;
        this._right = this.#cursorKeys.right.isDown;
        this._special = this.#cursorKeys.space.isDown;
    }
}
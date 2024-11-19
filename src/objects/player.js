// se puede importar un archivo de config para ajustar los valores

import { Coordinates } from "../types/typedef.js";
import { GameScreen } from "../scenes/gamescreen.js";
import { Character } from "./character.js";

const slowTime = 5000;
const slowAmmount = 0.5;

export class Player extends Character{

    /**
     * @param {GameScreen} scene 
     * @param {Coordinates} coordinates 
     */
    
    constructor(scene, coordinates, keyboardInput){
        super(scene, coordinates, keyboardInput);   // constructor de character
        
        // le añadimos el sprite
        this._sprite = scene.add.sprite(0, 0, 'character').setScale(0.1);
        this.add([this._sprite]);
        
    }

    slow(){
        this._acceleration -= slowAmmount;
        this._scene.time.delayedCall(slowTime, this.deactivateSlow, null, this);
    }

    deactivateSlow(){
        this._acceleration += slowAmmount;
    }

}
// se puede importar un archivo de config para ajustar los valores

import { Coordinates } from "../types/typedef.js";
import { GameScreen } from "../scenes/gamescreen.js";
import { Character } from "./character.js";

const trapCooldown = 20000;

export class Enemy extends Character{

    #trapOnCooldown;

    /**
     * @param {GameScreen} scene 
     * @param {Coordinates} coordinates 
     */
    
    constructor(scene, coordinates, keyManager){
        super(scene, coordinates, keyManager);    //constructor de character
        this._speed = 6;
        this.#trapOnCooldown = false;

        // le añadimos el sprite
        this._sprite = scene.add.sprite(0, 0, 'enemy').setScale(0.1);
        this.add([this._sprite]);
        
    }

    update(){
       
        if (this._keyboardInput.isMovingKeyPressedEnemy() && !this._movement.isMoving()){

            this.setTarget(this._keyboardInput.getDirectionEnemy());
            if(this._keyboardInput.isTurboKeyEnemyPressed() && !this._turboActive){
                this.activateTurbo(); 
            }
            if (this._scene.isWalkable(this._target))
                this._movement.move(this._target, this._speed, this._acceleration);
            else {
                this.resetTarget();
            }
        }
        if (this._keyboardInput.isTrapPressed() && !this.#trapOnCooldown)
            this.activateTrap();
       
    }

    activateTrap(){
        this.#trapOnCooldown = true;
        this._scene.setTrap(this._coordinates);
        this._scene.time.delayedCall(trapCooldown, () => {
            this.#trapOnCooldown = false;
        })
    }

}
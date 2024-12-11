import { GameScreen } from "../scenes/gamescreen.js";
import { Coordinates, DIRECTION } from "../types/typedef.js";

// clase Move, para seguir usando patron command uwu x2
export class Move{
    
    #gameObject;        // objeto que movemos
    #isMoving;

    /**@type {GameScreen} */
    #scene
    
    /**
     * Creamos el move
     * @param {GameScreen} scene 
     */

    constructor(gameObject, scene){
        this.#gameObject = gameObject;
        this.#scene = scene;
        this.#isMoving = false

        
    }
    
    isMoving(){
        return this.#isMoving;
    }

    move(targetPosition, speed, aceleration = 1){

        this.#isMoving = true;
        this.#scene.add.tween({
            targets: this.#gameObject,
            x: targetPosition.getRealX(),
            y: targetPosition.getRealY(),
            duration: 1000/(speed * aceleration),
            onComplete: () => {
                this.#isMoving = false;
                this.#gameObject.updateCoordinates();
            }
        })
    }
}
import { Coordinates, DIRECTION } from "../types/typedef.js";

// clase Move, para seguir usando patron command uwu x2
export class Move{
    
    #gameObject;        // objeto que movemos
    #speed;
    #isMoving;

    /**@type {Phaser.Scene} */
    #scene
    
    /**
     * Creamos el move
     * @param {Coordinates} coordinates 
     * @param {Phaser.Scene} scene 
     * @param {number} speed 
     */

    constructor(gameObject, coordinates, scene, speed = 5){
        this.#gameObject = gameObject;
        this.#scene = scene;
        this.#speed = speed;
        this.#isMoving = false

        
    }
    
    isMoving(){
        return this.#isMoving;
    }

    move(targetPosition, aceleration = 1){

        this.#isMoving = true;

        //Comprobacion de limites del laberinto para no salirse (los numeros son los del laberinto placeholder)
        if(targetPosition.x >= 26){
            targetPosition.x = 25;
        }
        if(targetPosition.x < 1){
            targetPosition.x = 1;
        }
        if(targetPosition.y >= 25){
            targetPosition.y = 24;
        }
        if(targetPosition.y < 1){
            targetPosition.y = 1;
        }
            

        this.#scene.add.tween({
            targets: this.#gameObject,
            x: targetPosition.getRealX(),
            y: targetPosition.getRealY(),
            duration: 1000/(this.#speed * aceleration),
            onComplete: () => {
                this.#isMoving = false;
                this.#gameObject.updateCoordinates();
            }
        })
    }
}
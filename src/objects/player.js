// se puede importar un archivo de config para ajustar los valores

import Phaser from "../lib/phaser.js";
import { InputManager } from "../components/inputManager.js";
import { Move } from "../components/move.js";
import { Coordinates, DIRECTION } from "../types/typedef.js";
import { GameScreen } from "../scenes/gamescreen.js";

const turboTime = 5000;
const turboCooldown = 20000;
const speed = 5;
const slowTime = 5000;
const slowAmmount = 0.5;
const acelerationMultiplier = 2;

export class Player extends Phaser.GameObjects.Container{
    // componentes del patron component de IV OwO

    /**@type {InputManager} */
    #keyboardInput;
    #movement;
    #sprite;
    #coordinates;
    #target;
    #speed;
    #acceleration;
    #turboActive;
    /**@type {GameScreen} */
    #scene;

    // Creamos el player, la escena donde aparece y la posicion
    /**
     * @param {GameScreen} scene 
     * @param {Coordinates} coordinates 
     */
    
    constructor(scene, coordinates, keyboardInput){
        // el [] es por si le pasamos otros objetos del juego
        super(scene, coordinates.getRealX(), coordinates.getRealY(), [])    //constructor base
        
        this.#scene = scene;
        this.#coordinates = coordinates;
        this.#target = new Coordinates(coordinates.x, coordinates.y);
        this.#speed = speed;
        this.#turboActive = false;
        this.#acceleration = 1;
        
        this.scene.add.existing(this);          // lo añadimos a la escena
        this.scene.physics.add.existing(this);  // le añadimos las fisicas de phaser 
        this.body.setSize(20, 20);              // le ponemos el colisionador a ese tamaño
        this.body.setCollideWorldBounds(true);  // colision con las paredes

        // le añadimos el sprite
        this.#sprite = scene.add.sprite(0, 0, 'character').setScale(0.1);
        this.add([this.#sprite]);
        
        // le añadimos los componentes
        this.#keyboardInput = keyboardInput;
        this.#movement =  new Move(this, scene, this.#speed);
        

        //listeners
        //Basicamente hacemos que cuando la escena use update, llame el update del player
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        // Cuando se acaba, destruimos este enlace (como el free de pga)
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        }, this)
    }

    update(){
        //console.log(ts,dt);
        this.#keyboardInput.update();
        if (this.#keyboardInput.isMovingKeyPressedPlayer() && !this.#movement.isMoving()){

            this.setTarget(this.#keyboardInput.getDirectionPlayer());
            if(this.#keyboardInput.isTurboKeyPlayerPressed() && !this.#turboActive){
                this.activateTurbo(); 
            }
            if (this.#scene.isWalkable(this.#target))
                this.#movement.move(this.#target, this.#acceleration);
            else {
                this.resetTarget();
                console.log("No me muevo")
            }
        }
            
    }

    slow(){
        this.#acceleration -= slowAmmount;
        this.#scene.time.delayedCall(slowTime, this.deactivateSlow, null, this);
    }

    deactivateSlow(){
        this.#acceleration += slowAmmount;
    }

    activateTurbo(){
        this.#turboActive = true;
        this.#acceleration = acelerationMultiplier;
        this.#scene.time.delayedCall(turboTime, this.deactivateTurbo, null, this);
    }

    deactivateTurbo(){
        this.#acceleration = 1;
        this.#scene.time.delayedCall(turboCooldown, ()=>{
            this.#turboActive = false;
        }, null, this);
    }

    setTarget(direction){
        switch(direction){
            case DIRECTION.UP:
                this.#target.y -= 1
                break;
            case DIRECTION.DOWN:
                this.#target.y += 1
                break;
            case DIRECTION.LEFT:
                this.#target.x -= 1
                break;
            case DIRECTION.RIGHT:
                this.#target.x += 1
                break;
            default:
                return;
        }
        
    }

    resetTarget(){
        this.#target.x = this.#coordinates.x;
        this.#target.y = this.#coordinates.y;
    }

    updateCoordinates(){
        this.#coordinates.x  = this.#target.x;
        this.#coordinates.y = this.#target.y;
    }

}
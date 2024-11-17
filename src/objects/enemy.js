// se puede importar un archivo de config para ajustar los valores

import Phaser from "../lib/phaser.js";
import { InputManager } from "../components/inputManager.js";
import { Move } from "../components/move.js";
import { Coordinates, DIRECTION } from "../types/typedef.js";
import { Trap } from "../objects/trap.js";

const turboTime = 6000;
const turboCooldown = 20000;

export class Enemy extends Phaser.GameObjects.Container{
    // componentes del patron component de IV OwO

    #keyboardInput;
    #movement;
    #sprite;
    #coordinates;
    #target;
    #speed;
    #acceleration;
    #turboActive;
    #scene
    #traps = [];

    // Creamos el player, la escena donde aparece y la posicion
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Coordinates} coordinates 
     */
    
    constructor(scene, coordinates){
        // el [] es por si le pasamos otros objetos del juego
        super(scene, coordinates.getRealX(), coordinates.getRealY(), [])    //constructor base
        
        this.#scene = scene;
        this.#coordinates = coordinates;
        this.#target = new Coordinates(coordinates.x, coordinates.y);
        this.#speed = 5;
        this.#turboActive = false;

        this.scene.add.existing(this);          // lo añadimos a la escena
        this.scene.physics.add.existing(this);  // le añadimos las fisicas de phaser 
        this.body.setSize(20, 20);              // le ponemos el colisionador a ese tamaño
        this.body.setCollideWorldBounds(true);  // colision con las paredes

        // le añadimos el sprite
        this.#sprite = scene.add.sprite(0, 0, 'enemy').setScale(0.1);
        this.add([this.#sprite]);
        
        // le añadimos los componentes
        this.#keyboardInput = new InputManager(this.scene);
        this.#movement =  new Move(this, coordinates, this.scene, this.#speed);

        // Crear una tecla para soltar trampas
        this.trapKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //listeners
        //Baseicamente hacemos que cuando la escena use update, llame el update del player
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        // Cuando se acaba, destruimos este enlace (como el free de pga)
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        }, this)
    }

    update(){
        //console.log(ts,dt);
        this.#keyboardInput.update();
        if (this.#keyboardInput.isMovingKeyPressedEnemy() && !this.#movement.isMoving()){
            this.setTarget(this.#keyboardInput.getDirectionEnemy());
            if(this.#keyboardInput.isTurboKeyEnemyPressed() && !this.#turboActive){
                this.activateTurbo(); 
            }
            //console.log(this.#scene.time)
            //console.log(this.#target.x, this.#target.y)
            this.#movement.move(this.#target, this.#acceleration);
            
            
        }
            
    }

    activateTurbo(){
        this.#turboActive = true;
        this.#acceleration = 2.5;
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

    updateCoordinates(){
        this.#coordinates.x  = this.#target.x;
        this.#coordinates.y = this.#target.y;
    }
}
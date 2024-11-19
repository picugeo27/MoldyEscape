import Phaser from "../lib/phaser.js";
import { InputManager } from "../components/inputManager.js";
import { Move } from "../components/move.js";
import { Coordinates, DIRECTION } from "../types/typedef.js";
import { GameScreen } from "../scenes/gamescreen.js";

const turboTime = 5000;
const turboCooldown = 20000;
const speed = 5;
const acelerationMultiplier = 2;

export class Character extends Phaser.GameObjects.Container{
     /**@type {InputManager} */
     _keyboardInput;
     _movement;
     _sprite;
     _coordinates;
     _target;
     _speed;
     _acceleration;
     _turboActive;
     /**@type {GameScreen} */
     _scene;
 
     // Creamos el player, la escena donde aparece y la posicion
     /**
      * @param {GameScreen} scene 
      * @param {Coordinates} coordinates 
      */
     
     constructor(scene, coordinates, keyboardInput){
         // el [] es por si le pasamos otros objetos del juego
         super(scene, coordinates.getRealX(), coordinates.getRealY(), [])    //constructor base
         
        this._scene = scene;
        this._coordinates = coordinates;
        this._target = new Coordinates(coordinates.x, coordinates.y);
        this._speed = speed;
        this._turboActive = false;
        this._acceleration = 1;
        
        this.scene.add.existing(this);          // lo añadimos a la escena
        this.scene.physics.add.existing(this);  // le añadimos las fisicas de phaser 
        this.body.setSize(24, 24);              // le ponemos el colisionador a ese tamaño
        this.body.setOffset(-12,-12);
        this.body.setCollideWorldBounds(true);  // colision con las paredes

        // le añadimos los componentes
        this._keyboardInput = keyboardInput;
        this._movement =  new Move(this, scene);
        

        //listeners
        //Basicamente hacemos que cuando la escena use update, llame el update del player
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        // Cuando se acaba, destruimos este enlace (como el free de pga)
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        }, this)
    }

    update(){
        this._keyboardInput.update();
        if (this._keyboardInput.isMovingKeyPressedPlayer() && !this._movement.isMoving()){

            this.setTarget(this._keyboardInput.getDirectionPlayer());
            if(this._keyboardInput.isTurboKeyPlayerPressed() && !this._turboActive){
                this.activateTurbo(); 
            }
            if (this._scene.isWalkable(this._target))
                this._movement.move(this._target, this._speed, this._acceleration);
            else {
                this.resetTarget();
                console.log("No me muevo")
            }
        }
            
    }

    activateTurbo(){
        this._turboActive = true;
        this._acceleration = acelerationMultiplier;
        this._scene.time.delayedCall(turboTime, this.deactivateTurbo, null, this);
    }

    deactivateTurbo(){
        this._acceleration = 1;
        this._scene.time.delayedCall(turboCooldown, ()=>{
            this._turboActive = false;
        }, null, this);
    }

    setTarget(direction){
        switch(direction){
            case DIRECTION.UP:
                this._target.y -= 1
                break;
            case DIRECTION.DOWN:
                this._target.y += 1
                break;
            case DIRECTION.LEFT:
                this._target.x -= 1
                break;
            case DIRECTION.RIGHT:
                this._target.x += 1
                break;
            default:
                return;
        }
        
    }

    resetTarget(){
        this._target.x = this._coordinates.x;
        this._target.y = this._coordinates.y;
    }

    updateCoordinates(){
        this._coordinates.x  = this._target.x;
        this._coordinates.y = this._target.y;
    }
}
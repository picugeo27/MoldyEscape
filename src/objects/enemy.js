// se puede importar un archivo de config para ajustar los valores

import { Coordinates, DIRECTION } from "../types/typedef.js";
import { GameScreen } from "../scenes/gamescreen.js";
import { Character } from "./character.js";

const trapCooldown = 20000;

export class Enemy extends Character{

    #trapOnCooldown;
    _setTrapSound;

    /**
     * @param {GameScreen} scene 
     * @param {Coordinates} coordinates 
     */
    
    constructor(scene, coordinates, keyManager){
        super(scene, coordinates, keyManager);    //constructor de character
        this._speed = 6;
        this.#trapOnCooldown = false;

        this._setTrapSound = this._scene.sound.add('set_trap', {volume:0.7})
        // le añadimos el sprite
        this._sprite = scene.add.sprite(0, -8, 'enemy').setScale(1.1);
        this.add([this._sprite]);
                // Definir las animaciones en el constructor
                this._scene.anims.create({
                    key: 'FWaLkIdle', 
                    frames: this._scene.anims.generateFrameNumbers('Fungo-Idle-Sheet', { start: 0, end: 5 }), 
                    frameRate: 8, 
                    repeat: -1 
                });
        
                this._scene.anims.create({
                    key: 'FWalkB',
                    frames: this._scene.anims.generateFrameNumbers('Fungo-WalkB-Sheet', { start: 0, end: 8 }),
                    frameRate: 15,
                    repeat: -1
                });
        
                this._scene.anims.create({
                    key: 'FWalkF',
                    frames: this._scene.anims.generateFrameNumbers('Fungo-WalkF-Sheet', { start: 0, end: 8 }),
                    frameRate: 15,
                    repeat: -1
                });
        
                this._scene.anims.create({
                    key: 'FWalkR',
                    frames: this._scene.anims.generateFrameNumbers('Fungo-WalkL-Sheet', { start: 0, end: 8 }),
                    frameRate: 15,
                    repeat: -1
                });
        
                this._scene.anims.create({
                    key: 'FWalkL',
                    frames: this._scene.anims.generateFrameNumbers('Fungo-WalkR-Sheet', { start: 0, end: 8 }),
                    frameRate: 15,
                    repeat: -1
                });
    }

    update(){
       
        if(this._keyboardInput.isTurboKeyEnemyPressed() && !this._turboActive){
            this.activateTurbo(); 
        }
        else if(this._keyboardInput.isTurboKeyEnemyPressed() && this._turboActive && !this._wrongButton.isPlaying && !this._turboSound.isPlaying){
            this._wrongButton.play();
        }

        if (this._keyboardInput.isMovingKeyPressedEnemy() && !this._movement.isMoving()){

            this.setTarget(this._keyboardInput.getDirectionEnemy());
            
            if (this._scene.isWalkable(this._target))
                this._movement.move(this._target, this._speed, this._acceleration);
            else {
                this.resetTarget();
            }
        }
        if (this._keyboardInput.isTrapPressed() && !this.#trapOnCooldown){
            this.activateTrap(); 
        }      

        if (this._keyboardInput.isMovingKeyPressedEnemy()) {
            // Dependiendo de la dirección, se cambia la animación
            if (this._keyboardInput.getDirectionEnemy() === DIRECTION.UP) {
                this._sprite.anims.play('FWalkB', true);
            } else if (this._keyboardInput.getDirectionEnemy() === DIRECTION.DOWN) {
                this._sprite.anims.play('FWalkF', true);
            } else if (this._keyboardInput.getDirectionEnemy() === DIRECTION.LEFT) {
                this._sprite.anims.play('FWalkR', true);
            } else if (this._keyboardInput.getDirectionEnemy() === DIRECTION.RIGHT) {
                this._sprite.anims.play('FWalkL', true);
            }
        } else {
            // Si no se está moviendo, se pone la animación de idle
            this._sprite.anims.play('FWaLkIdle', true);
        }

    }

    activateTrap(){
        this.#trapOnCooldown = true;
        this._setTrapSound.play();
        this._scene.setTrap(this._coordinates);
        this._scene.time.delayedCall(trapCooldown, () => {
            this.#trapOnCooldown = false;
        })
    }

}
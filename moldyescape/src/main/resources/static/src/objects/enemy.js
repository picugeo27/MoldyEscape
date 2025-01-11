// se puede importar un archivo de config para ajustar los valores

import { Coordinates, DIRECTION } from "../types/typedef.js";
import { GameScreen } from "../scenes/gamescreen.js";
import { Character } from "./character.js";
import { InfoType, Movement, Player, Sprint, Trap } from "../types/messages.js";

const trapCooldown = 15000;

export class Enemy extends Character{

    #trapOnCooldown;
    _setTrapSound;
    _sendInfo;
    _reciveInfo;
    /**@type {WebSocket} */
    socket;

    /**
     * @param {GameScreen} scene 
     * @param {Coordinates} coordinates 
     * @param {WebSocket} socket
     */
    
    constructor(scene, coordinates, keyManager, reciveInfo, sendInfo, socket){
        super(scene, coordinates, keyManager);    //constructor de character
        this._speed = 6;
        this._reciveInfo = reciveInfo;
        this._sendInfo = sendInfo;
        this.#trapOnCooldown = false;

        this.socket = socket;
        this._setTrapSound = this._scene.sound.add('set_trap', {volume:0.7})
        // le añadimos el sprite
        this._sprite = scene.add.sprite(0, -8, 'enemy').setScale(1.1);
        this.add([this._sprite]);
                // Definir las animaciones en el constructor
                this._scene.anims.create({
                    key: 'FWaLkIdle', 
                    frames: this._scene.anims.generateFrameNumbers('Fungo-Idle-Sheet', { start: 0, end: 4 }), 
                    frameRate: 8, 
                    repeat: -1 
                });
        
                this._scene.anims.create({
                    key: 'FWalkB',
                    frames: this._scene.anims.generateFrameNumbers('Fungo-WalkB-Sheet', { start: 0, end: 7 }),
                    frameRate: 15,
                    repeat: -1
                });
        
                this._scene.anims.create({
                    key: 'FWalkF',
                    frames: this._scene.anims.generateFrameNumbers('Fungo-WalkF-Sheet', { start: 0, end: 7 }),
                    frameRate: 15,
                    repeat: -1
                });
        
                this._scene.anims.create({
                    key: 'FWalkR',
                    frames: this._scene.anims.generateFrameNumbers('Fungo-WalkL-Sheet', { start: 0, end: 4 }),
                    frameRate: 15,
                    repeat: -1
                });
        
                this._scene.anims.create({
                    key: 'FWalkL',
                    frames: this._scene.anims.generateFrameNumbers('Fungo-WalkR-Sheet', { start: 0, end: 4 }),
                    frameRate: 15,
                    repeat: -1
                });
    }

    update(){
        if (this._reciveInfo){
            this.updateAnimations();
        }  else{
            this.updateLocal();
        }

    }

    updateLocal(){
        if(this._keyboardInput.isTurboKeyEnemyPressed() && !this._turboActive){
            this.activateTurbo(); 
            if (this._sendInfo)
                this.socket.send(JSON.stringify(new Sprint(Player.enemy)))
        }
        else if(this._keyboardInput.isTurboKeyEnemyPressed() && this._turboActive && !this._wrongButton.isPlaying && !this._turboSound.isPlaying){
            this._wrongButton.play();
        }

        if (this._keyboardInput.isMovingKeyPressedEnemy() && !this._movement.isMoving()){
            var auxDirection = this._keyboardInput.getDirectionEnemy();
            this.setTarget(auxDirection);
            
            if (this._scene.isWalkable(this._target)){
                this._movement.move(this._target, this._speed, this._acceleration);
                if (this._sendInfo)
                    this.socket.send(JSON.stringify(new Movement(auxDirection, Player.enemy)))
            }
                
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

    updateAnimations(){
        if (this._movement.isMoving()) {
            console.log("se esta moviendo)")
            if (super.getFacing() === DIRECTION.UP) {
                this._sprite.anims.play('FWalkB', true);
            } else if (super.getFacing() === DIRECTION.DOWN) {
                this._sprite.anims.play('FWalkF', true);
            } else if (super.getFacing() === DIRECTION.LEFT) {
                this._sprite.anims.play('FWalkR', true);
            } else if (super.getFacing() === DIRECTION.RIGHT) {
                this._sprite.anims.play('FWalkL', true);
            }
        } else{
            // Si no se está moviendo, se pone la animación de idle
            this._sprite.anims.play('FWaLkIdle', true);
        }

    }

    onlineUpdate(data){
        if (data.who == Player.player)
            return
        switch (data.type){
            case InfoType.movement: {
                this.onlineMovement(data);
                break;
            }
            case InfoType.trap: {
                console.log("entramos en trap del switch")
                this.onlinTrap(data.coordinates);
                break;
            }

            case InfoType.sprint: {
                this.activateTurbo();
                break;
            }

            case InfoType.update: {

            } 
            
            default:{
                console.log("Comando no reconocido");
            }
        }

    }

    onlineMovement(data){
        this.setTarget(data.direction);
            
        if (this._scene.isWalkable(this._target)){
            this._movement.move(this._target, this._speed, this._acceleration);
        }
            

        else {
            this.resetTarget();
        }
    }

    onlinTrap(coordinates){
        this._setTrapSound.play();
        console.log(coordinates)
        this._scene.setTrap(new Coordinates( coordinates.x, coordinates.y));
    }

    activateTrap(){
        if (this._sendInfo)
            this.socket.send(JSON.stringify(new Trap(this._coordinates)))

        this.#trapOnCooldown = true;
        this._setTrapSound.play();
        this._scene.setTrap(this._coordinates);
        this._scene.time.delayedCall(trapCooldown, () => {
            this.#trapOnCooldown = false;
        })
    }

}
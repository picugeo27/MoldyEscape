// se puede importar un archivo de config para ajustar los valores

import { Coordinates, DIRECTION } from "../types/typedef.js";
import { GameScreen } from "../scenes/gamescreen.js";
import { Character } from "./character.js";
import { PlayerType, InfoType, Sprint, Movement } from "../types/messages.js";

const slowTime = 5000;
const slowAmount = 0.5;
const animatorTimer = 500;

export class Player extends Character {

    /**
     * @param {GameScreen} scene 
     * @param {Coordinates} coordinates 
     */

    /**@type {WebSocket} */
    socket;

    _reciveInfo;
    _sendInfo;

    constructor(scene, coordinates, keyboardInput, reciveInfo, sendInfo, socket) {
        super(scene, coordinates, keyboardInput);   // constructor de character
        this.turboTime = 7000;
        this.turboCooldown = 8000;
        this._reciveInfo = reciveInfo;
        this._sendInfo = sendInfo;

        this.socket = socket;
        // le añadimos el sprite
        this._sprite = scene.add.sprite(0, 0, 'character').setScale(0.8);
        this.add([this._sprite]);

        // Definir las animaciones en el constructor
        this._scene.anims.create({
            key: 'CWalkIdle',
            frames: this._scene.anims.generateFrameNumbers('Cient-Idle-Sheet', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this._scene.anims.create({
            key: 'CWalkB',
            frames: this._scene.anims.generateFrameNumbers('Cient-WalkB-Sheet', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this._scene.anims.create({
            key: 'CWalkF',
            frames: this._scene.anims.generateFrameNumbers('Cient-WalkF-Sheet', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this._scene.anims.create({
            key: 'CWalkR',
            frames: this._scene.anims.generateFrameNumbers('Cient-WalkL-Sheet', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this._scene.anims.create({
            key: 'CWalkL',
            frames: this._scene.anims.generateFrameNumbers('Cient-WalkR-Sheet', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
    }

    slow() {
        this._acceleration -= slowAmount;
        this._scene.time.delayedCall(slowTime, this.deactivateSlow, null, this);
    }

    deactivateSlow() {
        this._acceleration += slowAmount;
    }

    // Método de actualización para cambiar las animaciones
    update(timer, delta) {
        this._timer += delta;
        if (this._reciveInfo) {
            this.updateAnimations();
        } else {
            this.updateLocal();
        }
    }

    updateAnimations() {
        if (this._movement.isMoving()) {
            // Dependiendo de la dirección, se cambia la animación
            if (this.getFacing() === DIRECTION.UP) {
                this._sprite.anims.play('CWalkB', true);
            } else if (this.getFacing() === DIRECTION.DOWN) {
                this._sprite.anims.play('CWalkF', true);
            } else if (this.getFacing() === DIRECTION.LEFT) {
                this._sprite.anims.play('CWalkR', true);
            } else if (this.getFacing() === DIRECTION.RIGHT) {
                this._sprite.anims.play('CWalkL', true);
            }
            this._timer = 0;
        } else if (this._timer >= animatorTimer) {
            // Si no se está moviendo, se pone la animación de idle
            this._sprite.anims.play('CWalkIdle', true);
        }
    }

    updateLocal() {
        super.update();
        if (this._keyboardInput.isTurboKeyPlayerPressed() && !this._turboActive) {
            this.activateTurbo();
            if (this._sendInfo)
                this.socket.send(JSON.stringify(new Sprint(PlayerType.player)))
        }
        //Si el turbo esta activo o en cooldown, al pulsar la tecla da error
        else if (this._keyboardInput.isTurboKeyPlayerPressed() && this._turboActive && !this._wrongButton.isPlaying && !this._turboSound.isPlaying) {
            this._wrongButton.play();
        }

        if (this._keyboardInput.isMovingKeyPressedPlayer() && !this._movement.isMoving()) {

            var auxDirection = this._keyboardInput.getDirectionPlayer()
            this.setTarget(auxDirection);

            if (this._scene.isWalkable(this._target)) {
                this._movement.move(this._target, this._speed, this._acceleration);
                if (this._sendInfo)
                    this.socket.send(JSON.stringify(new Movement(auxDirection, PlayerType.player)))
            }

            else {
                this.resetTarget();
            }
        }

        // Activar animaciones según la dirección del movimiento
        if (this._keyboardInput.isMovingKeyPressedPlayer()) {
            // Dependiendo de la dirección, se cambia la animación
            if (this._keyboardInput.getDirectionPlayer() === DIRECTION.UP) {
                this._sprite.anims.play('CWalkB', true);
            } else if (this._keyboardInput.getDirectionPlayer() === DIRECTION.DOWN) {
                this._sprite.anims.play('CWalkF', true);
            } else if (this._keyboardInput.getDirectionPlayer() === DIRECTION.LEFT) {
                this._sprite.anims.play('CWalkR', true);
            } else if (this._keyboardInput.getDirectionPlayer() === DIRECTION.RIGHT) {
                this._sprite.anims.play('CWalkL', true);
            }
        } else {
            // Si no se está moviendo, se pone la animación de idle
            this._sprite.anims.play('CWalkIdle', true);
        }
    }

    onlineUpdate(data) {
        if (data.who == PlayerType.enemy)
            return
        switch (data.type) {
            case InfoType.movement: {
                this.onlineMovement(data);
                break;
            }
            case InfoType.sprint: {
                this.activateTurbo();
                break;
            }

            case InfoType.update: {

            }

            default: {
                console.log("Comando no reconocido: " + data.type);
            }
        }
    }
    onlineMovement(data) {
        this.setTarget(data.direction);

        if (this._scene.isWalkable(this._target)) {
            this._movement.move(this._target, this._speed, this._acceleration);
        }


        else {
            this.resetTarget();
        }
    }
}
// se puede importar un archivo de config para ajustar los valores

import { Coordinates, DIRECTION } from "../types/typedef.js";
import { GameScreen } from "../scenes/gamescreen.js";
import { Character } from "./character.js";

const slowTime = 5000;
const slowAmount = 0.5;

export class Player extends Character{

    /**
     * @param {GameScreen} scene 
     * @param {Coordinates} coordinates 
     */
    
    constructor(scene, coordinates, keyboardInput){
        super(scene, coordinates, keyboardInput);   // constructor de character
        this.turboTime = 6000;
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
    update() {
        super.update();  // Llamamos al update de la clase Character (si tiene)

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
}
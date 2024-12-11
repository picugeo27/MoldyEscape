import Phaser from "../lib/phaser.js";
import { Coordinates } from "../types/typedef.js";


export class Trap extends Phaser.GameObjects.Sprite {
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Coordinates} coordinates
     */
    constructor(scene, coordinates) {
        super(scene, coordinates.getRealX(), coordinates.getRealY(), 'trap'); // Usa la imagen 'trap' cargada
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.body.setSize(10, 10); 
        this.body.setImmovable(true); 

        this.scene.time.delayedCall(1000, () => { // 1000 ms = 1 segundos
            this.setVisible(false);
        });
    }

}

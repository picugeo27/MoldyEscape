import Phaser from "../lib/phaser.js";

export class Trap extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'trap'); // Usa la imagen 'trap' cargada
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.setScale(0.05); 
        this.body.setSize(10, 10); 
        this.body.setImmovable(true); 

        this.scene.time.delayedCall(1000, () => { // 1000 ms = 1 segundos
            this.setVisible(false);
        });
    }
}
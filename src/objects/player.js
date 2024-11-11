export class Player extends Phaser.GameObjects.Container{
    #sprite;
    constructor(scene, player,startX = 0,startY = 0){
        // el [] es por si le pasamos otros objetos del juego
        super(scene, startX, startY, [])

        this.#sprite = scene.add.sprite(0,0, player);
        this.add([this.#sprite]);

    }
}
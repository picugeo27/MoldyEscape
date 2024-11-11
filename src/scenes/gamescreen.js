import { Player } from "../objects/player.js";

export class GameScreen extends Phaser.Scene{
    constructor(){
        super({key: 'GameScreen'});
    }

    preload(){

    }

    create(){
        this.add.image(0,0, 'game_background').setOrigin(0,0).setScale(0.6);
        
        const player = new Player(this, this.scale.width/2, this.scale.height/2);
        
        //this.#cursorKeys = this.input.keyboard.createCursorKeys();
        //console.log(this.#cursorKeys)
        // invocar una animacion
        // this.add.sprite(100, 100, 'boton_inicio').play('explotion');
    }
}
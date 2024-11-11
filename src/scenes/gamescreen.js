//import { Player } from "./player";
export class GameScreen extends Phaser.Scene{
    constructor(){
        super({key: 'GameScreen'});
    }

    preload(){

    }

    create(){
        this.add.image(0,0, 'game_background').setOrigin(0,0).setScale(0.6);
        //const player = new Player(this, "character", 0, 0);
        
        // invocar una animacion
        // this.add.sprite(100, 100, 'boton_inicio').play('explotion');
    }
}
import { Player } from "../objects/player.js";
import { Enemy } from "../objects/enemy.js";
import { Coordinates } from "../types/typedef.js";

export class GameScreen extends Phaser.Scene{
    constructor(){
        super({key: 'GameScreen'});
    }

    /**@type {Coordinates} */
    #playerCoordinates = new Coordinates(5,5);
    #enemyCoordinates = new Coordinates(20,20);

    create(){
        this.add.image(0,0, 'game_background').setOrigin(0,0).setScale(0.6);
        
        const player = new Player(this, this.#playerCoordinates);
        const enemy = new Enemy(this, this.#enemyCoordinates);
        
        //this.#cursorKeys = this.input.keyboard.createCursorKeys();
        //console.log(this.#cursorKeys)
        // invocar una animacion
        // this.add.sprite(100, 100, 'boton_inicio').play('explotion');
    }
}
import { Player } from "../objects/player.js";
import { Enemy } from "../objects/enemy.js";
import { Coordinates } from "../types/typedef.js";

const buttonsToWin = 3;

export class GameScreen extends Phaser.Scene{
    constructor(){
        super({key: 'GameScreen'});
    }

    /**@type {Coordinates} */
    #playerCoordinates = new Coordinates(5,5);
    #enemyCoordinates = new Coordinates(20,20);
    
    #buttons;

    pushedButtons;

    create(){
        this.add.image(0,0, 'game_background').setOrigin(0,0).setScale(0.6);
        
        this.pushedButtons = 0;

        const player = new Player(this, this.#playerCoordinates);
        const enemy = new Enemy(this, this.#enemyCoordinates);
        
        this.physics.add.overlap(player,enemy, this.enemyWin);
        /**
         * @type {Phaser.GameObjects.Group}
         */
        this.#buttons  = this.physics.add.group();

        this.#buttons[0] = this.#buttons.create(500,500, 'button').setScale(0.2);
        this.#buttons[1] = this.#buttons.create(200,100, 'button').setScale(0.2);
        this.#buttons[2] = this.#buttons.create(150,250, 'button').setScale(0.2);

        this.#buttons.children.iterate(element => {
            this.physics.add.overlap(player, element, this.pushButton)
        });

        console.log(this.#buttons);
        //this.#cursorKeys = this.input.keyboard.createCursorKeys();
        //console.log(this.#cursorKeys)
        // invocar una animacion
        // this.add.sprite(100, 100, 'boton_inicio').play('explotion');
    }

    playerWin(){
        console.log("Player gana")
    }

    enemyWin(){
        console.log("Enemigo gana")
    }

    pushButton(player, element){
        element.destroy();
        this.pushedButtons +=1;
        console.log(this.pushedButtons)
        if (this.pushedButtons >= buttonsToWin)
            this.playerWin();
    }
}
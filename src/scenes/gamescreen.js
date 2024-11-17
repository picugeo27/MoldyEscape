import { Player } from "../objects/player.js";
import { Enemy } from "../objects/enemy.js";
import { Coordinates } from "../types/typedef.js";
import { InputManager } from "../components/inputManager.js";
import { Trap } from "../objects/trap.js";

const buttonsToWin = 3;

export class GameScreen extends Phaser.Scene{
    constructor(){
        super({key: 'GameScreen'});
    }

    /**@type {Coordinates} */
    #playerCoordinates = new Coordinates(5,5);
    #enemyCoordinates = new Coordinates(20,20);
    #keyManager;
    #buttons;
    #traps;

    #pushedButtons = 0;
    
    #player;
    #enemy;
    create(){
        this.endGame.bind(this);
        this.add.image(0,0, 'game_background').setOrigin(0,0).setScale(0.6);
        
        this.#keyManager = new InputManager(this);

        this.#player = new Player(this, this.#playerCoordinates, this.#keyManager);
        this.#enemy = new Enemy(this, this.#enemyCoordinates, this.#keyManager);
        
        this.physics.add.overlap(this.#player, this.#enemy, this.enemyWin.bind(this));

        /** @type {Phaser.GameObjects.Group} */
        this.#buttons  = this.physics.add.group();

        this.#buttons[0] = this.#buttons.create(500,500, 'button').setScale(0.2);
        this.#buttons[1] = this.#buttons.create(200,100, 'button').setScale(0.2);
        this.#buttons[2] = this.#buttons.create(150,250, 'button').setScale(0.2);

        this.#buttons.children.iterate(element => {
            this.physics.add.overlap(this.#player, element, this.pushButton)
        });

        /** @type {Phaser.GameObjects.Group} */
        this.#traps = this.physics.add.group();

        
        //this.#cursorKeys = this.input.keyboard.createCursorKeys();
        //console.log(this.#cursorKeys)
        // invocar una animacion
        // this.add.sprite(100, 100, 'boton_inicio').play('explotion');
    }

    playerWin(){
        console.log("Player gana");
        this.endGame();
    }

    enemyWin(){
        console.log("Enemigo gana");
        this.endGame();
    }

    pushButton = (player, element) =>{
        element.destroy();
        this.#pushedButtons +=1;
        console.log(this.#pushedButtons)
        if (this.#pushedButtons >= buttonsToWin)
            this.playerWin();
    }

    /**
     * @param {Coordinates} coordinates 
     */

    setTrap(coordinates){
        const trap = new Trap(this, coordinates);
        this.#traps.add(trap);
        
        this.physics.add.overlap(this.#player, trap, () => {
            console.log(this.#player)
            this.#player.slow();
            trap.destroy();
            console.log(this.#player)
        })

        console.log(this.#traps.children)
    }
    endGame(){
        this.scene.remove('GameScreen');
        this.scene.start('EndScreen');
    }

}
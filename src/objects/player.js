// se puede importar un archivo de config para ajustar los valores

import Phaser from "../lib/phaser.js";
import { InputManager } from "../components/inputManager.js";
import { Move } from "../components/move.js";

export class Player extends Phaser.GameObjects.Container{
    // componentes del patron component de IV OwO

    #keyboardInput;
    #movement;
    #sprite;

    // Creamos el player, la escena donde aparece y la posicion
    constructor(scene, startX = 0, startY = 0){
        // el [] es por si le pasamos otros objetos del juego
        super(scene, startX, startY, [])    //constructor base

        this.scene.add.existing(this);          // lo añadimos a la escena
        this.scene.physics.add.existing(this);  // le añadimos las fisicas de phaser - todavia no me van y no se por que
        this.body.setSize(20, 20);              // le ponemos el colisionador a ese tamaño
        this.body.setOffset(-10,-5);            // esto es para mover el cubito de la colision, porque no estaba bien centrado
        this.body.setCollideWorldBounds(true);  // colision con las paredes

        // le añadimos el sprite
        this.#sprite = scene.add.sprite(0,0, 'character').setScale(0.1);
        this.add([this.#sprite]);
        
        // le añadimos los componentes
        this.#keyboardInput = new InputManager(this.scene);
        this.#movement =  new Move(this, this.#keyboardInput);

        //listeners
        //Baseicamente hacemos que cuando la escena use update, llame el update del player
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        // Cuando se acaba, destruimos este enlace (como el free de pga)
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        }, this)
    }

    update(ts,dt){
        //console.log(ts,dt);
        this.#keyboardInput.update();
        this.#movement.update();
    }
}
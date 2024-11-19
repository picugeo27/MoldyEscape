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

    /** @type {Phaser.Tilemaps.TilemapLayer}*/
    #colliderLayer = null;
    /**@type {Coordinates} */
    #playerCoordinates = new Coordinates(5,5);
    /**@type {Coordinates} */
    #enemyCoordinates = new Coordinates(10,10);
    /**@type {InputManager} */
    #keyManager;

    #buttons;
    #traps;

    #pushedButtons = 0;
    
    /**@type {Player} */
    #player;
    /**@type {Enemy} */
    #enemy;

    // este metodo carga el tileset, el map value es porque facilita poner mas mapas (solo habria que decirle cual queremos)
    preload(mapValue){
        const tileMapData = this.cache.json.get('maps_pack');

        tileMapData.maps.forEach(element => { 
            this.load.tilemapTiledJSON(element.key, element.path, );
        });
    }

    create(){
        // Metodo que cambia de escena cuando se acabe, independientemente del resultado
        this.endGame.bind(this);
        
        // Creamos el tilemap y las capas
        const map = this.make.tilemap({key: 'Laboratorio', tileHeight: 24, tileWidth: 24});
        const tileset = map.addTilesetImage("Lab", "lab_tiles");
        const layer = map.createLayer("Fondo", tileset, 0, 0);              //Capa de fondo
        this.#colliderLayer = map.createLayer("Borders", tileset, 0, 0);    //Capa de colliders
        
        // Creamos key manager, jugador, enemigo y su colision
        this.#keyManager = new InputManager(this);      

        this.#player = new Player(this, this.#playerCoordinates, this.#keyManager);
        this.#enemy = new Enemy(this, this.#enemyCoordinates, this.#keyManager);
        
        this.physics.add.overlap(this.#player, this.#enemy, this.enemyWin.bind(this));

        // aqui llamamos el metodo que crea los botones, lo separe para que create no sea tan grande
        this.createButtons();
        
        /** @type {Phaser.GameObjects.Group} */
        this.#traps = this.physics.add.group();

        // ejemplo para invocar una animacion
        // this.add.sprite(100, 100, 'boton_inicio').play('explotion');
    }

    createButtons(){
        /** @type {Phaser.GameObjects.Group} */
        this.#buttons  = this.physics.add.group();

        // aqui metemos las coordeanadas de todos los botones que queramos
        const buttonsPosition = [
            new Coordinates(1,1),
            new Coordinates (20, 8),
            new Coordinates(11, 20),
        ]
        // se crean los botones y la colision con el personaje
        buttonsPosition.forEach((coordinates, index) => {
            this.#buttons[index] = this.#buttons.create(coordinates.getRealX(), coordinates.getRealY(), 'button').setScale(0.1)
            this.physics.add.overlap(this.#player, this.#buttons[index], this.pushButton)
        });

    }

    // que hacer cuando gana el jugador
    playerWin(){
        console.log("Player gana");
        this.endGame();
    }

    // que hacer cuando gana el monstruo
    enemyWin(){
        console.log("Enemigo gana");
        this.endGame();
    }

    // Cuando se pulsa un boton que se hace (no podemos quitar ese player que no se usa porque sino por como se invoca el player desaparece)
    pushButton = (player, element) =>{
        element.destroy();
        this.#pushedButtons +=1;
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
            this.#player.slow();
            trap.destroy();
        })
    }
    endGame(){
        this.scene.remove('GameScreen');
        this.scene.start('EndScreen');
    }

    /**
     * 
     * @param {Coordinates} coordinates 
     */
    
    isWalkable(coordinates){

        const tile = this.#colliderLayer.getTileAt(coordinates.x,coordinates.y);
        return tile == null || tile.index == 0;
    }
}
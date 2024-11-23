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
    /** @type {Phaser.Tilemaps.TilemapLayer}*/
    #doorLayer = null;
    /**@type {Coordinates} */
    #playerCoordinates = new Coordinates(5,5);
    /**@type {Coordinates} */
    #enemyCoordinates = new Coordinates(10,10);
    /**@type {InputManager} */
    #keyManager;

    #buttons;
    #traps;

    //Boolean que indica si es el player quien ha ganado
    #playerIsWinner

    #pushedButtons = 0;
    
    /**@type {Player} */
    #player;
    /**@type {Enemy} */
    #enemy;

    #mapUsed;
    #mapKey;

    _pressButtonSound;

    init(data){
        this.mapValue = data.data;
        console.log('MapValue recibido:', this.mapValue);
    }
    preload(){
        const tileMapData = this.cache.json.get('maps_pack');
        if (this.mapValue == undefined)
            this.mapValue = 1;
        console.log(tileMapData.maps[this.mapValue]);

        this.load.tilemapTiledJSON(tileMapData.maps[this.mapValue].key, tileMapData.maps[this.mapValue].path);
        this.#mapKey = tileMapData.maps[this.mapValue].key;
        this.#mapUsed = tileMapData.maps[this.mapValue].name;

        this.cameras.main.fadeIn(500,0,0,0);
    }

    create(){

        // Creamos el tilemap y las capas
        const map = this.make.tilemap({key: this.#mapKey, tileHeight: 24, tileWidth: 24});    //1 para mapa 1, 2 para mapa 2
        const tileset = map.addTilesetImage(this.#mapUsed, "lab_tiles");   //1 para mapa 1, 2 para mapa 2
        const backgroundLayer = map.createLayer("Fondo", tileset, 0, 0);     //Capa de fondo
        this.#colliderLayer = map.createLayer("Paredes", tileset, 0, 0);    //Capa de colliders
        this.#doorLayer = map.createLayer("Puertas", tileset, 0, 0);    //Capa de puertas

        // Creamos key manager, jugador, enemigo y su colision
        this.#keyManager = new InputManager(this);      

        this.#player = new Player(this, this.#playerCoordinates, this.#keyManager);
        this.#enemy = new Enemy(this, this.#enemyCoordinates, this.#keyManager);
        
        //this.physics.add.overlap(this.#player, this.#enemy, this.enemyWin);
        this.physics.add.overlap(this.#player, this.#enemy, this.enemyWin.bind(this));

        // aqui llamamos el metodo que crea los botones, lo separe para que create no sea tan grande
        this.createButtons();
        
        /** @type {Phaser.GameObjects.Group} */
        this.#traps = this.physics.add.group();

        this._pressButtonSound = this.sound.add('take_button', {volume:1})

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
        this.scene.remove('GameScreen');
        //const playerIsWinner = true;
        this.scene.start('EndScreen', {playerIsWinner: true, map: this.mapValue});
        //this.endGame();
    }

    // que hacer cuando gana el monstruo
    enemyWin(){
        console.log("Enemigo gana");
        this.scene.remove('GameScreen');
        //const playerIsWinner = false;
        this.scene.start('EndScreen', {playerIsWinner: false, map: this.mapValue});
        //this.endGame();
    }


    // Cuando se pulsa un boton que se hace (no podemos quitar ese player que no se usa porque sino por como se invoca el player desaparece)
    pushButton = (player, element) =>{
        this._pressButtonSound.play();
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

    /*
    endGame(player, playerIsWinner){
        //console.log("Player gana");
        this.scene.remove('GameScreen');
        this.scene.start('EndScreen', playerIsWinner);
    }
    */

    /**
     * 
     * @param {Coordinates} coordinates 
     */
    
    isWalkable(coordinates){

        const tile = this.#colliderLayer.getTileAt(coordinates.x,coordinates.y);
        return tile == null || tile.index == 0;
    }
}
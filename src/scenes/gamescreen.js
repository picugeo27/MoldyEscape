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

    _pressButtonSound;

    // este metodo carga el tileset, el map value es porque facilita poner mas mapas (solo habria que decirle cual queremos)
    preload(mapValue){
        const tileMapData = this.cache.json.get('maps_pack');

        tileMapData.maps.forEach(element => { 
            this.load.tilemapTiledJSON(element.key, element.path, );
        });

        //Cargar Sprites Personajes
        this.load.spritesheet('Cient-Idle-Sheet', 'assets/Animaciones/Cientifica/Cient-Idle-Sheet.png', { frameWidth: 25, frameHeight: 40 });
        this.load.spritesheet('Cient-WalkB-Sheet', 'assets/Animaciones/Cientifica/Cient-WalkB-Sheet.png', { frameWidth: 32, frameHeight: 40 });
        this.load.spritesheet('Cient-WalkF-Sheet', 'assets/Animaciones/Cientifica/Cient-WalkF-Sheet.png', { frameWidth: 32, frameHeight: 40 });
        this.load.spritesheet('Cient-WalkL-Sheet', 'assets/Animaciones/Cientifica/Cient-WalkL-Sheet.png', { frameWidth: 32, frameHeight: 40 });
        this.load.spritesheet('Cient-WalkR-Sheet', 'assets/Animaciones/Cientifica/Cient-WalkR-Sheet.png', { frameWidth: 32, frameHeight: 40 });

        this.load.spritesheet('Fungo-Idle-Sheet', 'assets/Animaciones/Fungo/Fungo-Idle-Sheet.png', { frameWidth: 25, frameHeight: 40 });
        this.load.spritesheet('Fungo-WalkB-Sheet', 'assets/Animaciones/Fungo/Fungo-WalkB-Sheet.png', { frameWidth: 32, frameHeight: 40 });
        this.load.spritesheet('Fungo-WalkF-Sheet', 'assets/Animaciones/Fungo/Fungo-WalkF-Sheet.png', { frameWidth: 32, frameHeight: 40 });
        this.load.spritesheet('Fungo-WalkL-Sheet', 'assets/Animaciones/Fungo/Fungo-WalkL-Sheet.png', { frameWidth: 32, frameHeight: 40 });
        this.load.spritesheet('Fungo-WalkR-Sheet', 'assets/Animaciones/Fungo/Fungo-WalkR-Sheet.png', { frameWidth: 32, frameHeight: 40 });
    }

    create(){

        
        // Metodo que cambia de escena cuando se acabe, independientemente del resultado
        //this.endGame.bind(this);
        
        // Creamos el tilemap y las capas
        const map = this.make.tilemap({key: 'Laboratorio1', tileHeight: 24, tileWidth: 24});    //1 para mapa 1, 2 para mapa 2
        const tileset = map.addTilesetImage("Lab1", "lab_tiles");   //1 para mapa 1, 2 para mapa 2
        const backgroundLayer = map.createLayer("Fondo", tileset, 0, 0);     //Capa de fondo
        this.#colliderLayer = map.createLayer("Paredes", tileset, 0, 0);    //Capa de colliders
        this.#doorLayer = map.createLayer("Puertas", tileset, 0, 0);    //Capa de puertas

        // Creamos key manager, jugador, enemigo y su colision
        this.#keyManager = new InputManager(this);      

        this.#player = new Player(this, this.#playerCoordinates, this.#keyManager);
        this.#player.update();
        this.#enemy = new Enemy(this, this.#enemyCoordinates, this.#keyManager);
        
        //this.physics.add.overlap(this.#player, this.#enemy, this.enemyWin);
        this.physics.add.overlap(this.#player, this.#enemy, this.enemyWin.bind(this));

        // aqui llamamos el metodo que crea los botones, lo separe para que create no sea tan grande
        this.createButtons();
        
        /** @type {Phaser.GameObjects.Group} */
        this.#traps = this.physics.add.group();

        this._pressButtonSound = this.sound.add('take_button', {volume:1})

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
        this.scene.remove('GameScreen');
        //const playerIsWinner = true;
        this.scene.start('EndScreen', {playerIsWinner: true});
        //this.endGame();
    }

    // que hacer cuando gana el monstruo
    enemyWin(){
        console.log("Enemigo gana");
        this.scene.remove('GameScreen');
        //const playerIsWinner = false;
        this.scene.start('EndScreen', {playerIsWinner: false});
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
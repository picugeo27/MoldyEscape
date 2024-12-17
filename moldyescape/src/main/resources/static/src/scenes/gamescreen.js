import { Player } from "../objects/player.js";
import { Enemy } from "../objects/enemy.js";
import { Coordinates, MAP_INIT } from "../types/typedef.js";
import { InputManager } from "../components/inputManager.js";
import { Trap } from "../objects/trap.js";

const buttonsToWin = 3;

export class GameScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScreen' });
    }

    /** @type {Phaser.Tilemaps.TilemapLayer}*/
    #colliderLayer = null;
    /** @type {Phaser.Tilemaps.TilemapLayer}*/
    #doorLayer = null;
    /**@type {Coordinates} */
    #playerCoordinates = new Coordinates(15, 9);
    /**@type {Coordinates} */
    #enemyCoordinates = new Coordinates(9, 15);
    /**@type {InputManager} */
    #keyManager;

    #buttons;
    #traps;

    #pushedButtons = 0;

    /**@type {Player} */
    #player;
    /**@type {Enemy} */
    #enemy;

    #mapUsed;
    #mapKey;

    _pressButtonSound;
    _gameMusic;

    init(data) {
        this.mapValue = data.data;
    }

    preload() {
        this.scale.resize(960, this.scale.height);

        //Particulas
        this.load.image('particle', 'assets/Interactuables/particula.png');
        this.load.image('trapParticle', 'assets/Interactuables/particulaTrampa.png');

        const tileMapData = this.cache.json.get('maps_pack');
        if (this.mapValue != 0 && this.mapValue != 1)
            this.mapValue = 1;

        this.load.tilemapTiledJSON(tileMapData.maps[this.mapValue].key, tileMapData.maps[this.mapValue].path);
        this.#mapKey = tileMapData.maps[this.mapValue].key;
        this.#mapUsed = tileMapData.maps[this.mapValue].name;

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    create() {

        // Creamos el tilemap y las capas
        const map = this.make.tilemap({ key: this.#mapKey, tileHeight: 24, tileWidth: 24 });    //1 para mapa 1, 2 para mapa 2
        const tileset = map.addTilesetImage(this.#mapUsed, "lab_tiles");   //1 para mapa 1, 2 para mapa 2
        const backgroundLayer = map.createLayer("Fondo", tileset, MAP_INIT, 0);     //Capa de fondo
        this.#colliderLayer = map.createLayer("Paredes", tileset, MAP_INIT, 0);    //Capa de colliders
        this.#doorLayer = map.createLayer("Puertas", tileset, MAP_INIT, 0);    //Capa de puertas

        this.add.image(0, 0, "banner_player").setOrigin(0, 0);
        this.add.image(780, 0, "banner_enemy").setOrigin(0, 0);

        // Creamos key manager, jugador, enemigo y su colision
        this.#keyManager = new InputManager(this);

        this.#player = new Player(this, this.#playerCoordinates, this.#keyManager);
        this.#enemy = new Enemy(this, this.#enemyCoordinates, this.#keyManager);

        this.physics.add.overlap(this.#player, this.#enemy, this.enemyWin.bind(this));

        // aqui llamamos el metodo que crea los botones, lo separe para que create no sea tan grande
        this.createButtons();

        /** @type {Phaser.GameObjects.Group} */
        this.#traps = this.physics.add.group();

        this._pressButtonSound = this.sound.add('take_button', { volume: 1 });
        this._gameMusic = this.sound.add('game_music', { loop: true, volume: 1 });
        this._gameMusic.play();



        /////////////////////////////////////
    }

    createButtons() {
        /** @type {Phaser.GameObjects.Group} */
        this.#buttons = this.physics.add.group();

        // aqui metemos las coordeanadas de todos los botones que queramos
        const buttonsPosition = [
            new Coordinates(1, 1),
            new Coordinates(23, 1),
            new Coordinates(1, 23),
            new Coordinates(23, 23)
        ]
        // se crean los botones y la colision con el personaje
        buttonsPosition.forEach((coordinates, index) => {
            this.#buttons[index] = this.#buttons.create(coordinates.getRealX(), coordinates.getRealY(), 'button').setScale(1)
            this.physics.add.overlap(this.#player, this.#buttons[index], this.pushButton)
        });

    }

    // que hacer cuando gana el jugador
    playerWin() {
        this._gameMusic.stop();
        this.scene.remove('GameScreen');
        this.scene.start('EndScreen', { playerIsWinner: true, map: this.mapValue });
    }

    // que hacer cuando gana el monstruo
    enemyWin() {
        this._gameMusic.stop();
        this.scene.remove('GameScreen');
        this.scene.start('EndScreen', { playerIsWinner: false, map: this.mapValue });
    }


    // Cuando se pulsa un boton que se hace (no podemos quitar ese player que no se usa porque sino por como se invoca el player desaparece)
    pushButton = (player, element) => {
        this._pressButtonSound.play();

        //particulas
        element.setFrame(1);
        this.leverParticle(element.x, element.y);
        element.body.enable = false;
        this.#pushedButtons += 1;
        if (this.#pushedButtons >= buttonsToWin)
            this.playerWin();
    }

    /**
     * @param {Coordinates} coordinates 
     */

    setTrap(coordinates) {
        const trap = new Trap(this, coordinates);
        this.#traps.add(trap);
        this.trapParticle(coordinates.getRealX(), coordinates.getRealY());

        this.physics.add.overlap(this.#player, trap, () => {
            this.#player.slow();
            trap.destroy();
        })
    }

    /**
     * 
     * @param {Coordinates} coordinates 
     */

    isWalkable(coordinates) {

        const tile = this.#colliderLayer.getTileAt(coordinates.x, coordinates.y);
        return tile == null || tile.index == 0;
    }

    leverParticle(leverX, leverY) {
        const particleDuration = 500;
        const emitter = this.add.particles(leverX, leverY, 'particle', {
            angle: { min: 0, max: 360 },
            speed: { min: 50, max: 100 },
            lifespan: 200,
            gravityY: 200,
            quantity: 1,
        })
        this.time.delayedCall(particleDuration, () => {
            emitter.stop();
        })
    }

    trapParticle(coordX, coordY) {
        const particleDuration = 500;
        const emitter = this.add.particles(coordX, coordY, 'trapParticle', {
            angle: { min: 0, max: 360 },
            speed: { min: 50, max: 100 },
            lifespan: 200,
            gravityY: 200,
            quantity: 1,
        })
        this.time.delayedCall(particleDuration, () => {
            emitter.stop();
        })
    }
}
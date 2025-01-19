import { Player } from "../objects/player.js";
import { Enemy } from "../objects/enemy.js";
import { Coordinates, MAP_INIT } from "../types/typedef.js";
import { InputManager } from "../components/inputManager.js";
import { Trap } from "../objects/trap.js";
import { InfoType, PlayerType, Winner } from "../types/messages.js";

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

    _online;
    _onlinePlayer;  // el player es controlado de fuera (no local)
    _onlineEnemy;   // el enemigo es controlado de fuera (no local)

    _currentMusic;

    /**@type {WebSocket} */
    _socket;

    init(data) {
        this._onlinePlayer = false;
        this._onlineEnemy = false;
        this.mapValue = data.map;
        if (data.online) {
            this._online = data.online;
            if (data.role == 0)
                this._onlinePlayer = true;
            else
                this._onlineEnemy = true;
            var socket = this.registry.get("socket");
            this.configSocket(socket);
        }
    }

    preload() {
        this.scale.resize(960, this.scale.height);

        //Particulas
        this.load.image('particle', 'assets/Interactuables/particula.png');
        this.load.image('trapParticle', 'assets/Interactuables/particulaTrampa.png');

        const tileMapData = this.cache.json.get('maps_pack');
        if (this.mapValue < 0 || this.mapValue >= tileMapData.maps.length)
            this.mapValue = 1;

        this.load.tilemapTiledJSON(tileMapData.maps[this.mapValue].key, tileMapData.maps[this.mapValue].path);
        this.#mapKey = tileMapData.maps[this.mapValue].key;
        this.#mapUsed = tileMapData.maps[this.mapValue].name;

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    create() {

        this._socket = this.registry.get("socket");

        // Creamos el tilemap y las capas
        const map = this.make.tilemap({ key: this.#mapKey, tileHeight: 24, tileWidth: 24 });    //1 para mapa 1, 2 para mapa 2, 3 para el 3
        console.log("Valor de mapUsed " + this.#mapUsed);
        console.log("Tipo de mapUsed " + typeof this.#mapUsed);
        const tileset = map.addTilesetImage(this.#mapUsed, "lab_tiles");   //1 para mapa 1, 2 para mapa 2, 3 para el 3
        const backgroundLayer = map.createLayer("Fondo", tileset, MAP_INIT, 0);     //Capa de fondo
        this.#colliderLayer = map.createLayer("Paredes", tileset, MAP_INIT, 0);    //Capa de colliders
        this.#doorLayer = map.createLayer("Puertas", tileset, MAP_INIT, 0);    //Capa de puertas

        this.add.image(0, 0, "banner_player").setOrigin(0, 0);
        this.add.image(780, 0, "banner_enemy").setOrigin(0, 0);

        // Creamos key manager, jugador, enemigo y su colision
        this.#keyManager = new InputManager(this);

        this.#player = new Player(this, this.#playerCoordinates, this.#keyManager, this._onlinePlayer, this._onlineEnemy, this._socket); // equivale a "me controlan" o controlo
        this.#enemy = new Enemy(this, this.#enemyCoordinates, this.#keyManager, this._onlineEnemy, this._onlinePlayer, this._socket);
        this.#player.setDepth(10);
        this.#enemy.setDepth(10);
        this.physics.add.overlap(this.#player, this.#enemy, this.enemyWin.bind(this));

        // aqui llamamos el metodo que crea los botones, lo separe para que create no sea tan grande
        this.createButtons();

        /** @type {Phaser.GameObjects.Group} */
        this.#traps = this.physics.add.group();

        this._metalPipeSound = this.sound.add("metal_pipe", {volume : 0.5});
        this._pressButtonSound = this.sound.add('take_button', { volume: 1 });
        this._gameMusic = this.sound.add('game_music', { loop: true, volume: 1 });
        this._pacmanMusic = this.sound.add('pacman_music', { loop: true, volume: 1 });
        if (this.#mapKey === "Laboratorio3") {
            this._currentMusic = this._pacmanMusic;
            //this._pacmanMusic.play();
        }
        else {
            //this._gameMusic.play();
            this._currentMusic = this._gameMusic;
        }

        this._currentMusic.play();
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.scene.launch('PauseScreen', { online: this._online });
            if (!this._online)
                this.scene.pause();

            this.scene.bringToTop('PauseScreen');
        }
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
        this._currentMusic.stop();
        if (this._online) {
            this.sendWinner(PlayerType.player)
            this._socket.close();
        }
        this.scene.remove('GameScreen');
        this.scene.start('EndScreen', { playerIsWinner: true, online: this._online, iWon: (this._online && this._onlineEnemy) });
    }

    // que hacer cuando gana el monstruo
    enemyWin() {
        this._currentMusic.stop();
        if (this._online) {
            this.sendWinner(PlayerType.enemy)
            this._socket.close();
        }
        this.scene.remove('GameScreen');
        this.scene.start('EndScreen', { playerIsWinner: false, online: this._online, iWon: (this._online && this._onlinePlayer) });
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

    /**
     * 
     * @param {WebSocket} socket 
     */
    configSocket(socket) {
        socket.onmessage = (message) => {

            try {
                const data = JSON.parse(message.data);
                console.log(data);
                if (data.type == InfoType.winner) {
                    this.onlineWinner(data.who);
                } else if (data.type == InfoType.disconnect) {
                    this._metalPipeSound.play();
                    setTimeout(() => {
                        if (this._onlinePlayer)
                            this.onlineWinner(PlayerType.enemy);
                        else
                            this.onlineWinner(PlayerType.player);
                    }, 3000);
                    // if (this._onlinePlayer)
                    //     this.onlineWinner(PlayerType.enemy)
                    // else
                    //     this.onlineWinner(PlayerType.player);
                }
                else {
                    if (this._onlinePlayer) {
                        this.#player.onlineUpdate(data);
                    } else if (this._onlineEnemy) {
                        this.#enemy.onlineUpdate(data);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    onlineWinner(who) {
        this._gameMusic.stop();
        this._socket.close();

        if (who == PlayerType.enemy) {
            this.scene.start('EndScreen', { playerIsWinner: false, online: this._online, iWon: (this._online && this._onlinePlayer) });
        } else {
            this.scene.start('EndScreen', { playerIsWinner: true, online: this._online, iWon: (this._online && this._onlineEnemy) });
        }
        this.scene.remove('GameScreen');
    }

    sendWinner(who) {
        if (this._online)
            this._socket.send(JSON.stringify(new Winner(who)));
    }

}
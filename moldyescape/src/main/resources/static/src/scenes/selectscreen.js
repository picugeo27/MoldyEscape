import { GameScreen } from "./gamescreen.js";
import { setupButton } from "../types/typedef.js";

export class SelectScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectScreen' });
    }

    #selectedMap;
    #indexSelectedMap = 0;
    #mapList = [];
    #clickCount = 0;
    #titleText;

    preload() {
        const mapData = this.cache.json.get('maps_pack');
    
        // Cargar las vistas previas de los mapas
        mapData.preview.forEach((element) => {
            if (!this.#mapList.includes(element.key)) {
                try {
                    this.load.image(element.key, element.url);
                    this.#mapList.push(element.key);
                    console.log('Vista previa cargada:', element.key);
                } catch (error) {
                    console.error('Error al cargar la vista previa:', element.key, error);
                }
            }
        });
    
        console.log('Número de vistas previas cargadas:', this.#mapList.length);
    
        mapData.maps.forEach((map) => {
            this.load.tilemapTiledJSON(map.key, map.path);
            console.log('Cargando mapa:', map.key);
        });
    }
    

    create() {
        this.add.image(0, 0, 'credits_background').setOrigin(0, 0);
    
        // Almacenar la referencia al texto inicial
        this.#titleText = this.add.text(115, 40, 'SELECCIONA UN NIVEL', {
            color: '#ffffff',
            fontSize: 50,
            stroke: '#df5fa8',
            strokeThickness: 4,
        });
    
        const menuMusic = this.registry.get('menuMusic');
        const boton_click = this.sound.add('boton_click', { volume: 1 });
        const boton_flecha_click = this.sound.add('boton_flecha_click', { volume: 1 });
    
        const boton_jugar = this.add.image(400, 550, "boton_jugar").setScale(0.95);
        const boton_atras = this.add.image(100, 550, "boton_volver");
        const boton_tutorial = this.add.image(680, 550, "boton_tutorial");
    
        this.#selectedMap = this.add.image(this.scale.width / 2, this.scale.height / 2, this.#mapList[this.#indexSelectedMap]).setScale(0.6);
    
        setupButton(boton_jugar, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            var selectedMap = this.#indexSelectedMap;
                if (this.#indexSelectedMap === 3) {
                    selectedMap = Math.floor(Math.random() * 3); // Genera un índice aleatorio entre 0 y 2
                    console.log('Nivel 4 seleccionado, eligiendo aleatorio:', selectedMap);
                }
            this.cameras.main.once('camerafadeoutcomplete', () => {
                menuMusic.stop();
                this.scene.stop("SelectScreen");
              this.scene.add('GameScreen', GameScreen);
                this.scene.start("GameScreen", { map: selectedMap, online: false, role: null });

            });
        });
    
        setupButton(boton_atras, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("SelectScreen");
                this.scene.start("StartScreen");
            });
        });
    
        setupButton(boton_tutorial, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("SelectScreen");
                this.scene.start("TutorialScreen");
            });
        });
    
        const boton_flecha = this.add.image(520, 550, "boton_flecha").setScale(0.9)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.time.delayedCall(500, () => {
                    this.incrementClickCount(); // Incrementa el contador
                    this.nextMap();
                });
            });
    
        boton_flecha.flipX = true;
    
        const boton_flecha_2 = this.add.image(280, 550, "boton_flecha").setScale(0.9)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.time.delayedCall(500, () => {
                    this.incrementClickCount(); // Incrementa el contador
                    this.previousMap();
                });
            });

        this.#clickCount = 0; // Reinicia el contador a 0

    }

    incrementClickCount() {
        this.#clickCount++; // Incrementa el contador
    
        if (this.#clickCount > 20) {
            this.#titleText.setText('¡ESCOGE UN NIVEL YA!'); // Cambia el texto del título
        }
    }

    nextMap() {
        this.#indexSelectedMap = (this.#indexSelectedMap + 1) % this.#mapList.length;
        this.#selectedMap.setTexture(this.#mapList[this.#indexSelectedMap]);
    }
    previousMap() {
        this.#indexSelectedMap = (this.#indexSelectedMap - 1 + this.#mapList.length) % this.#mapList.length;
        this.#selectedMap.setTexture(this.#mapList[this.#indexSelectedMap]);
    }
}

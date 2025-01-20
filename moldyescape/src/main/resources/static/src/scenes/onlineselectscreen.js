import { GameScreen } from "./gamescreen.js";
import { popUpText, setupButton } from "../types/typedef.js";
import { Vote } from "../types/messages.js";

export class OnlineSelectScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'OnlineSelectScreen' });
    }

    #selectedMap;
    #indexSelectedMap = 0;
    #mapList = [];
    #clickCount = 0;
    #titleText;
    voted = false;
    socket;

    preload() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cache.json.get('maps_pack').preview.forEach((element) => {
            if (!this.#mapList.includes(element.key)) {
                this.load.image(element.key, element.url);
                this.#mapList.push(element.key);

            }
        });
    }

    create() {
        this.add.image(0, 0, 'credits_background').setOrigin(0, 0).setScale(0.17);

        // Almacenar la referencia al texto inicial
        this.#titleText = this.add.text(115, 40, 'SELECCIONA UN NIVEL', {
            color: '#ffffff',
            fontSize: 50,
            stroke: '#df5fa8',
            strokeThickness: 4,
        });

        this.votePopupText = this.add.text(400, 70, 'HAS VOTADO ESTE NIVEL', {
            fontSize: 35,
            color: '#df5fa8',
            stroke: '#df5fa8',
            strokeThickness: 2,
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 }
        })
            .setVisible(false)
            .setOrigin(0.5);

        const host = window.location.host;

        const menuMusic = this.registry.get('menuMusic');
        const boton_click = this.sound.add('boton_click', { volume: 1 });
        const boton_flecha_click = this.sound.add('boton_flecha_click', { volume: 1 });
        const boton_atras = this.add.image(100, 550, "boton_volver").setScale(1.3);
        this.boton_votar = this.add.image(400, 550, "boton_votar").setScale(1.3);
        this.boton_cancelar = this.add.image(400, 550, "boton_cancelar").setVisible(false).setScale(1.3);


        this.#selectedMap = this.add.image(this.scale.width / 2, this.scale.height / 2, this.#mapList[this.#indexSelectedMap]).setScale(0.6);


        /*  
        Ajustes de botones
        */
        // CAMBIAR POR BOTON VOTAR
        setupButton(this.boton_votar, () => {
            boton_click.play();
            if (!this.voted)
                this.vote()
        });

        setupButton(this.boton_cancelar, () => {
            boton_click.play();
            if (this.voted)
                this.cancelVote()
        });

        setupButton(boton_atras, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.socket.close();
                this.voted = false;
                this.scene.stop("OnlineSelectScreen");
                this.scene.start("StartScreen");
            });
        });

        // setupButton(boton_tutorial, () => {
        //     boton_click.play();
        //     this.cameras.main.fadeOut(500, 0, 0, 0);
        //     this.cameras.main.once('camerafadeoutcomplete', () => {
        //         this.scene.stop("SelectScreen");
        //         this.scene.start("TutorialScreen");
        //     });
        // });

        this.boton_flecha = this.add.image(520, 550, "boton_flecha").setScale(1.3)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.nextMap();
            });

        this.boton_flecha.flipX = true;

        this.boton_flecha_2 = this.add.image(280, 550, "boton_flecha").setScale(1.3)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.previousMap();
            });

        this.#clickCount = 0; // Reinicia el contador a 0

        /**
         * COMUNICACION
         */

        this.socket = new WebSocket("ws://" + host + "/game");
        this.socket.onopen = () => {
            console.log("Conexion abierta");
            this.registry.set("socket", this.socket);

        }

        this.socket.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                console.log(data.type);
                if (data.type == "start") {
                    if (menuMusic)
                        menuMusic.stop();
                    this.startGame(data.value, data.role)
                }
                else
                    console.log(data.type + " No soportado");


            } catch (error) {
                console.log(error)
            }
            console.log(message.data);
        }

        this.socket.onclose = () => {
            console.log('Conexión cerrada');
            this.registry.remove(this.socket);
        };

    }

    incrementClickCount() {
        this.#clickCount++; // Incrementa el contador

        // Verificar si el contador supera el valor deseado
        if (this.#clickCount > 10) {
            this.#titleText.setText('¡ESCOGE UN NIVEL YA!'); // Cambia el texto del título
        }
    }

    nextMap() {
        if (this.voted)
            return
        this.incrementClickCount();
        this.#indexSelectedMap = (this.#indexSelectedMap + 1) % this.#mapList.length;
        this.#selectedMap.setTexture(this.#mapList[this.#indexSelectedMap]);
    }
    previousMap() {
        if (this.voted)
            return
        this.incrementClickCount();
        this.#indexSelectedMap = (this.#indexSelectedMap - 1 + this.#mapList.length) % this.#mapList.length;
        this.#selectedMap.setTexture(this.#mapList[this.#indexSelectedMap]);
    }

    startGame(mapValue, thisRole) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.socket.onmessage = null;
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.voted = false;
            this.scene.stop("SelectScreen");
            this.scene.add('GameScreen', GameScreen);
            this.scene.start("GameScreen", { map: mapValue, online: true, role: thisRole });
        });
    }

    vote() {
        this.voted = true;
        const vote = new Vote(this.#indexSelectedMap)
        this.socket.send(JSON.stringify(vote));
        this.boton_votar.setVisible(false);
        this.boton_cancelar.setVisible(true);
        this.boton_flecha.setVisible(false);
        this.boton_flecha_2.setVisible(false);
        popUpText(this, "votacion recibida");
        //this.showPopupText();

    }

    cancelVote() {
        this.voted = false;
        const vote = new Vote(-1);
        this.socket.send(JSON.stringify(vote));
        this.boton_votar.setVisible(true);
        this.boton_cancelar.setVisible(false);
        this.boton_flecha.setVisible(true);
        this.boton_flecha_2.setVisible(true);
    }
    /*
        showPopupText() {
            this.votePopupText.setVisible(true);
            this.time.delayedCall(800, () => {
                this.votePopupText.setVisible(false);
            });
    
    
        }*/
}

import { GameScreen } from "./gamescreen.js";
import { setupButton } from "../types/typedef.js";
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
        this.cache.json.get('maps_pack').preview.forEach((element) => {
            if (!this.#mapList.includes(element.key)) {
                this.load.image(element.key, element.url);
                this.#mapList.push(element.key);

            }
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
    
        const host = window.location.host;

        const menuMusic = this.registry.get('menuMusic');
        const boton_click = this.sound.add('boton_click', { volume: 1 });
        const boton_flecha_click = this.sound.add('boton_flecha_click', { volume: 1 });
    
        const boton_jugar = this.add.image(400, 550, "boton_jugar").setScale(0.95);
        const boton_atras = this.add.image(100, 550, "boton_volver");
        const boton_tutorial = this.add.image(680, 550, "boton_tutorial");
    
        this.#selectedMap = this.add.image(this.scale.width / 2, this.scale.height / 2, this.#mapList[this.#indexSelectedMap]).setScale(0.6);
        

        /*  
        Ajustes de botones
        */
        // CAMBIAR POR BOTON VOTAR
        setupButton(boton_jugar, () => {
            boton_click.play();
            if (this.voted)
                this.cancelVote()
            else 
                this.vote()
        });
    
        setupButton(boton_atras, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.socket.close();
                this.scene.stop("OnlineSelectScreen");
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
                this.nextMap();
            });
    
        boton_flecha.flipX = true;
    
        const boton_flecha_2 = this.add.image(280, 550, "boton_flecha").setScale(0.9)
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
            try{
                const data = JSON.parse(message.data);
                console.log(data.type);
                if (data.type == "start"){
                    menuMusic.stop();
                    this.startGame(data.value, data.role)
                }
                else 
                console.log(data.type + " No soportado");

                
            }catch(error){
                console.log(error)
            }
            
            console.log(message.data);
        }

        this.socket.onclose = () => {
            console.log('Conexión cerrada');
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("OnlineSelectScreen");
                this.scene.start("StartScreen");
            });
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

    startGame(mapValue, thisRole){
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop("SelectScreen");
            this.scene.add('GameScreen', GameScreen);
            this.scene.start("GameScreen", { map: mapValue, online: true, role: thisRole });
        });
    }

    vote(){
        this.voted = true;
        const vote = new Vote(this.#indexSelectedMap)
        this.socket.send(JSON.stringify(vote));

    }

    cancelVote(){
        this.voted = false;
        const vote = new Vote(-1);
        this.socket.send(JSON.stringify(vote));
    }
}

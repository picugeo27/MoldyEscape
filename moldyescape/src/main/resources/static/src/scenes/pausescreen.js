import { setupButton, SIZE_CANVAS } from "../types/typedef.js";

export class PauseScreen extends Phaser.Scene {

    constructor() {
        super({ key: 'PauseScreen' });
    }

    _online;
    _music;
    _socket;

    init(data) {
        this._online = data.online;
        this._music = data.music;
    }

    create() {
        console.log("PauseScreen aqui");

        const boton_click = this.sound.add('boton_click', { volume: 1 });

        const fondo = this.add.rectangle(SIZE_CANVAS.WIDTH / 2 + 80, SIZE_CANVAS.HEIGHT / 2, 600, 400, 0x000000, 0.8);//.setOrigin(0.5);

        const boton_reanudar = this.add.image(475, 300, "boton_reanudar").setScale(1.3);
        setupButton(boton_reanudar, () => {
            boton_click.play();
            this.scene.stop();
            this.scene.resume("GameScreen");

        });

        const boton_inicio = this.add.image(475, 395, "boton_inicio").setScale(1.3);
        setupButton(boton_inicio, () => {

            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("PauseScreen");
                this._music.stop();
                this.scene.remove('GameScreen');
                if (this._online) {
                    this._socket = this.registry.get("socket");
                    this._socket.close();
                }
                this.scene.start("StartScreen");
            })

        });

        const boton_tutorial = this.add.image(220, 140, "boton_tutorial").setScale(1.3);
        setupButton(boton_tutorial, () => {
            boton_click.play();
            this.cameras.main.fadeOut(250, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                console.log('Launching TutorialScreen');
                this.scene.bringToTop('TutorialScreen');
                this.scene.start('TutorialScreen', { previousScreen: 'PauseScreen' });

            });
        });

        this.add.text(395, 150, 'PAUSA',
            { color: '#ffffff', fontSize: 50, stroke: '#df5fa8', strokeThickness: 4 });

    }



}
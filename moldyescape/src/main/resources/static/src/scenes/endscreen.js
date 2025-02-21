import { setupButton } from "../types/typedef.js";

export class EndScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScreen' });
    }

    //Si es true, es que la cientifica ha ganado, sino ha ganado la seta
    #playerIsWinner;
    #iWon;
    _victorySound;
    _online;


    init(data) {
        this.#playerIsWinner = data.playerIsWinner;
        this.#iWon = data.iWon;
        this._online = data.online;
    }

    preload() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.load.image('particle', 'assets/Interactuables/particula.png');
    }

    create() {
        //Los botones tienen colores distintos espero que me perdoneis xd
        this.registry.remove('menuMusic');

        this._victorySound = this.sound.add('end_victory', { volume: 1 })
        this._victorySound.play();
        const arte_seta = this.add.image(100, 10, 'arte_seta').setOrigin(0, 0).setScale(0.9);
        const arte_cientifica = this.add.image(500, 5, 'arte_cientifica').setOrigin(0, 0).setScale(1);

        if (this.#playerIsWinner) {
            arte_seta.setTint(0x333333);
            this.add.text(135, 400, 'MONSTRUO PIERDE', { color: '#ffffff', fontSize: 30, stroke: '#df5fa8', strokeThickness: 4 });
            this.add.text(560, 400, 'CIENTÍFICA GANA', { color: '#ffffff', fontSize: 30, stroke: '#df5fa8', strokeThickness: 4 });
        }
        else {
            arte_cientifica.setTint(0x333333);
            this.add.text(150, 400, 'MONSTRUO GANA', { color: '#ffffff', fontSize: 30, stroke: '#df5fa8', strokeThickness: 4 });
            this.add.text(550, 400, 'CIENTÍFICA PIERDE', { color: '#ffffff', fontSize: 30, stroke: '#df5fa8', strokeThickness: 4 });
        }

        const boton_inicio = this.add.image(300, 520, "boton_inicio").setScale(1.3);
        setupButton(boton_inicio, () => {

            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this._victorySound.stop();
                this.scene.stop("EndScreen");
                this.scene.start("StartScreen");
            })

        });

        const boton_nueva_partida = this.add.image(500, 520, "boton_nueva_partida").setScale(1.3);
        setupButton(boton_nueva_partida, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this._victorySound.stop();
                this.scene.stop("EndScreen");
                this.scene.start("SelectScreen");
            })
        })

        if (this._online)
            boton_nueva_partida.setVisible(false);
        else boton_nueva_partida.setVisible(true);

        const boton_ajustes = this.add.image(700, 520, "boton_ajustes").setScale(1.3);
        setupButton(boton_ajustes, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this._victorySound.stop();
                this.scene.stop("EndScreen");
                this.scene.start("SettingsScreen");
            })
        })

        this.victoryParticle();
        this.saveWin();
    }

    victoryParticle() {
        const particleDuration = 4000;
        const emitter = this.add.particles(this.scale.width / 2, -40, 'particle', {
            angle: { min: -50, max: 200 },
            speed: { min: 200, max: 300 },
            lifespan: 4500,
            gravityY: 200,
            quantity: 2,
        })
        this.time.delayedCall(particleDuration, () => {
            emitter.stop();
        })
    }

    saveWin() {
        if (this.#iWon) {
            $.ajax({
                method: "PUT",
                url: "/users/win",
                contentType: 'application/json',
                data: connectedUser.username
            }).done((data) => {
                console.log(data);
            })
                .fail(function (data) {
                    console.log(data);
                });
        }
    }
}
import { popUpText, setupButton } from "../types/typedef.js";

const OFFLINE_MESSAGE = "no esta disponible sin conexion";

export class StartScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScreen' });
    }

    preload() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    create() {
        console.log(this.cameras.main.height)
        console.log(this.cameras.main.width)
        this.input.keyboard.manager.enabled = true;
        this.add.image(0, 0, 'start_background').setOrigin(0, 0);

        const boton_click = this.sound.add('boton_click', { volume: 1 });
        const boton_flecha_click = this.sound.add('boton_flecha_click', { volume: 1 });

        let menuMusic = this.registry.get('menuMusic');

        if (!menuMusic) {
            // Si no existe, crearlo y guardarlo en el registro
            menuMusic = this.sound.add('menu_music', { loop: true, volume: 0.5 });
            menuMusic.play();
            this.registry.set('menuMusic', menuMusic);
        } else if (!menuMusic.isPlaying) {
            menuMusic.play();
        }

        const boton_ranking = this.add.image(140, 550, "boton_ranking");
        const boton_jugar = this.add.image(415, 550, "boton_jugar");
        const boton_ajustes = this.add.image(675, 475, "boton_ajustes");
        const boton_creditos = this.add.image(675, 550, "boton_creditos");

        const boton_logout = this.add.image(650, 100, "boton_logout").setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                connectedUser.logOut;
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.stop("StartScreen");
                    this.scene.start("LoginScreen");
                });
            });;

        setupButton(boton_ranking, () => {
            if (connectedUser.logged) {
                boton_click.play();
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.stop("StartScreen");
                    this.scene.start("RankingScreen");
                });
            } else {
                popUpText(this, OFFLINE_MESSAGE);
            }

        })

        const boton_chat = this.add.image(140, 475, "boton_chat");

        setupButton(boton_chat, () => {
            if (connectedUser.logged) {
                boton_click.play();
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.stop("StartScreen");
                    this.scene.start("ChatScreen");
                });
            } else {
                popUpText(this, OFFLINE_MESSAGE);
            }


        })

        setupButton(boton_jugar, () => {
            if (boton_local.visible) {
                boton_click.play();
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.stop("StartScreen");
                    this.scene.start("SelectScreen");
                });
            } else if (connectedUser.logged && boton_red.visible) {
                boton_click.play();
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.stop("StartScreen");
                    this.scene.start("OnlineSelectScreen");
                });
            } else {
                popUpText(this, OFFLINE_MESSAGE);
            }


        })

        setupButton(boton_ajustes, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("StartScreen");
                this.scene.start("SettingsScreen");
            });
        })

        setupButton(boton_ajustes, () => {
            boton_click.play()
        }
        )
        setupButton(boton_creditos, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("StartScreen");
                this.scene.start("CreditsScreen");
            });
        });

        var boton_local = this.add.image(415, 475, "boton_local")
            .setInteractive()
            .on('pointerdown', () => {
                boton_click.play();
            });

        var boton_red = this.add.image(415, 475, "boton_en_red").setVisible(false)
            .setInteractive()
            .on('pointerdown', () => {
                console.log("No soportado todavía");
            });

        boton_red.setDisplaySize(165, 50);

        const boton_flecha = this.add.image(520, 475, "boton_flecha")
        boton_flecha.flipX = true;
        boton_flecha.setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.switchBoton(boton_local, boton_red)
            });

        const boton_flecha_2 = this.add.image(310, 475, "boton_flecha")
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.switchBoton(boton_local, boton_red)
            });
    }

    switchBoton(boton_local, boton_red) {
        if (boton_local.visible) {
            boton_local.setVisible(false);
            boton_red.setVisible(true);
        }
        else {
            boton_red.setVisible(false);
            boton_local.setVisible(true);
        }
    }

}
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
        this.input.keyboard.manager.enabled = true;
        this.add.image(0, 0, 'start_background').setOrigin(0, 0).setScale(0.17);

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

        const boton_ranking = this.add.image(860, 560, "boton_ranking").setScale(1.3);
        const boton_jugar = this.add.image(480, 365, "boton_jugar").setScale(1.3);
        const boton_ajustes = this.add.image(920, 560, "boton_ajustes").setScale(1.3);
        const boton_creditos = this.add.image(480, 430, "boton_creditos").setScale(1.3);
        const boton_tutorialtxt = this.add.image(480, 495, "boton_tutorialtxt").setScale(1.3);

        const boton_logout = this.add.image(920, 40, "boton_logout").setInteractive().setScale(1.3)
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

        const boton_chat = this.add.image(800, 560, "boton_chat").setScale(1.3);

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
        })
        
        setupButton(boton_tutorialtxt, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("SettingsScreen");
                this.scene.start("TutorialScreen", { previousScreen: 'StartScreen' });
            });
        });

        var boton_local = this.add.image(480, 300, "boton_local").setScale(1.3)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.switchBoton(boton_local, boton_red)
            });

        var boton_red = this.add.image(480, 300, "boton_en_red").setVisible(false).setScale(1.3)
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
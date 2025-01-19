import { setupButton } from "../types/typedef.js";

export class StartScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScreen' });
    }

    preload() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    create() {

        this.add.image(0, 0, 'start_background').setOrigin(0, 0);

        const boton_click = this.sound.add('boton_click', { volume: 1 });
        const boton_flecha_click = this.sound.add('boton_flecha_click', { volume: 1 });


        let menuMusic = this.registry.get('menuMusic');

        if (!menuMusic) {
            // Si no existe, crearlo y guardarlo en el registro
            menuMusic = this.sound.add('menu_music', { loop: true, volume: 0.5 });
            menuMusic.play();
            this.registry.set('menuMusic', menuMusic);
        }

        const boton_ranking = this.add.image(140, 550, "boton_ranking");
        const boton_jugar = this.add.image(415, 550, "boton_jugar");
        const boton_ajustes = this.add.image(675, 475, "boton_ajustes");
        const boton_creditos = this.add.image(675, 550, "boton_creditos");

        setupButton(boton_ranking, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("StartScreen");
                this.scene.start("RankingScreen");
            });

        })

        const boton_chat = this.add.image(140, 475, "boton_chat");

        setupButton(boton_chat, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("StartScreen");
                this.scene.start("ChatScreen");
            });

        })

        setupButton(boton_jugar, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("StartScreen");
                if (boton_red.visible)
                    this.scene.start("OnlineSelectScreen");
                else
                    this.scene.start("SelectScreen");
            });

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

        const boton_flecha = this.add.image(520, 475, "boton_flecha").setScale(0.9)
        boton_flecha.flipX = true;
        boton_flecha.setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.switchBoton(boton_local, boton_red)
            });

        const boton_flecha_2 = this.add.image(310, 475, "boton_flecha").setScale(0.9)
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

    init(data) {
        //this.mapValue = data.data;
    }

}
import { setupButton } from "../types/typedef.js";

export class TutorialScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScreen' });
    }

    #previousScreen;

    preload() {
        this.load.image('objetivos', 'assets/Tutorial/Objetivos.png');
        this.load.image('controles', 'assets/Tutorial/Controles.png');
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    controls;
    objectives;

    create() {

        this.registry.get('menuMusic');

        this.controls = this.add.image(this.scale.width / 2, this.scale.height / 2, "controles").setScale(0.7);
        this.objectives = this.add.image(this.scale.width / 2, this.scale.height / 2, "objetivos").setScale(0.7).setVisible(false);

        const boton_volver = this.add.image(100, 550, "boton_volver");
        setupButton(boton_volver, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("TutorialScreen");
                this.scene.start(this.#previousScreen);
            })
        });

        const boton_2 = this.add.image(650, 550, "boton_siguiente");
        boton_2.setInteractive();
        boton_2.on('pointerover', () => {
            boton_2.postFX.addShine(0.8, 0.05, 1);
        });

        boton_2.on('pointerout', () => {
            boton_2.setScale(0.95);
            boton_2.postFX.clear();
        });

        boton_2.on('pointerup', () => {
            boton_2.setScale(boton_2.scale += 0.05);
        });

        boton_2.on('pointerdown', () => {
            boton_2.setScale(boton_2.scale -= 0.05);
            this.controls.setVisible(!this.controls.visible);
            this.objectives.setVisible(!this.objectives.visible);
        });

    }

    init(data) {
        this.#previousScreen = data.previousScreen;
        //this.#playerIsWinner = data.playerIsWinner;
        //this._mapValue = data.map;
        //console.log(data.map)
    }

}

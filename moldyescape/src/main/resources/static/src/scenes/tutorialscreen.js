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

        const boton_click = this.sound.add('boton_click', { volume: 1 });

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

        const boton_siguiente = this.add.image(650, 550, "boton_siguiente");
        setupButton(boton_siguiente, () => {
            boton_click.play();
            this.controls.setVisible(!this.controls.visible);
            this.objectives.setVisible(!this.objectives.visible);
            boton_siguiente.setVisible(false);
            boton_anterior.setVisible(true);
        });

        const boton_anterior = this.add.image(650, 550, "boton_anterior").setVisible(false);
        setupButton(boton_anterior, () => {
            boton_click.play();
            this.controls.setVisible(!this.controls.visible);
            this.objectives.setVisible(!this.objectives.visible);
            boton_siguiente.setVisible(true);
            boton_anterior.setVisible(false);
        });

    }

    init(data) {
        this.#previousScreen = data.previousScreen;
    }

}

class StartScreen extends Phaser.Scene{
    constructor(){
        super({key: 'StartScreen'});
    }

    preload() {
        
        this.load.image("boton_jugar", "assets/placeholders/BotonJugar.png");
        this.load.image("boton_ajustes", "assets/placeholders/BotonAjustes.png");
        this.load.image("boton_creditos", "assets/placeholders/BotonCreditos.png");
        this.load.image("boton_local", "assets/placeholders/BotonLocal.png");
        this.load.image("boton_en_red", "assets/placeholders/BotonEnRed.png");
        this.load.image("boton_flecha", "assets/placeholders/BotonFlecha.png");
        this.load.image("boton_flecha_2", "assets/placeholders/BotonFlecha.png");
        this.load.image("background", "assets/placeholders/StartBackgroundPlaceholder.png");
    }

    create() {
        //const hello_text = this.add.text(150, 50, 'Welcome to the Pong Game!', { fill: '#0f0', fontSize: 38 })

        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1);
        const boton_jugar = this.add.image(400, 550, "boton_jugar");
        //     .setInteractive()
        //     .on('pointerdown', () => {
        //         this.sound.play("select");
        //         this.scene.stop("IntroScene");
        //         this.scene.start("GameScene");
        // });
        var boton_local = this.add.image(675, 400, "boton_local");
        var boton_red = this.add.image(675, 400, "boton_en_red").setVisible(false);
        const boton_flecha = this.add.image(780, 400, "boton_flecha").setScale(0.15)
            .setInteractive()
            .on('pointerdown', () => {
                if(boton_local.visible) {
                    boton_local.setVisible(false);
                    boton_red.setVisible(true);
                }
                else {
                    boton_red.setVisible(false);
                    boton_local.setVisible(true);  
                }
                
        });
        const boton_flecha_2 = this.add.image(570, 400, "boton_flecha_2").setScale(0.15).setRotation(3.14)
        .setInteractive()
            .on('pointerdown', () => {
                
                if(boton_local.visible) {
                    boton_local.setVisible(false);
                    boton_red.setVisible(true);
                }
                else {
                    boton_red.setVisible(false);
                    boton_local.setVisible(true);  
                }
        });
        const boton_ajustes = this.add.image(675, 475, "boton_ajustes").setScale(0.95);
        const boton_creditos = this.add.image(675, 550, "boton_creditos").setScale(0.9);
        
    }

    update() {}

}
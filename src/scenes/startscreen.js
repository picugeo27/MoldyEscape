export class StartScreen extends Phaser.Scene{
    constructor(){
        super({key: 'StartScreen'});
    }

    preload() {
        this.load.pack('image_pack', "assets/data.json");
        this.load.json('animation_pack', 'assets/animation.json');
        // AHORA TODO SE CARGA EN EL PACK
   }

    create() {
        //const hello_text = this.add.text(150, 50, 'Welcome to the Pong Game!', { fill: '#0f0', fontSize: 38 })

        this.add.image(0, 0, 'start_background').setOrigin(0, 0).setScale(1);
        const boton_jugar = this.add.image(400, 550, "boton_jugar")
             .setInteractive()
             .on('pointerdown', () => {
                 //this.sound.play("select");
                 this.scene.stop("IntroScreen");
                 this.scene.start("GameScreen");
         });

        var boton_local = this.add.image(675, 400, "boton_local");
        var boton_red = this.add.image(675, 400, "boton_en_red").setVisible(false);
        
        const boton_flecha = this.add.image(780, 400, "boton_flecha").setScale(0.15)
            .setInteractive()
            .on('pointerdown', () => this.switchBoton(boton_local,boton_red));
        
        const boton_flecha_2 = this.add.image(570, 400, "boton_flecha").setScale(0.15).setRotation(3.14)
            .setInteractive()
            .on('pointerdown', () => this.switchBoton(boton_local, boton_red));
        const boton_ajustes = this.add.image(675, 475, "boton_ajustes").setScale(0.95)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.stop("IntroScreen");
            this.scene.start("EndScreen")});

        const boton_creditos = this.add.image(675, 550, "boton_creditos").setScale(0.9);
        this.#createAnimations();
    }

    update() {}

    switchBoton(boton_local, boton_red){
        if(boton_local.visible) {
            boton_local.setVisible(false);
            boton_red.setVisible(true);
        }
        else {
            boton_red.setVisible(false);
            boton_local.setVisible(true);  
        }
    }

    #createAnimations(){
        // nos llevamos la informacion del json de animaciones
        const data = this.cache.json.get('animation_pack');
        data.forEach(element => {   // por cada una de las animaciones
            const frames = element.frames ? this.anims.generateFrameNames(element.assetKey, {frames: element.frames}):  // buscamos que valor de frames tiene, si no tiene ninguno lo creamos
            this.anims.generateFrameNumbers(element.assetKey);                                                          // los frames los saca del json donde le ponemos el ancho y alto de cada frame
            this.anims.create({         // el anims.create crea una animacion, y cogemos la informacion del json y se la asignamos a cada una de la animacion
                key: element.key,
                frames: frames,
                frameRate: element.frameRate,
                repeat: element.repeat,
            });
        });
    }
}
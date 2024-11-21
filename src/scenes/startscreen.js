import { GameScreen } from "./gamescreen.js";

export class StartScreen extends Phaser.Scene{
    constructor(){
        super({key: 'StartScreen'});
    }

    preload() {
        this.load.pack('image_pack', "assets/data.json");
        this.load.json('animation_pack', 'assets/animation.json');
        this.load.json('maps_pack', 'assets/maps.json');
        this.load.pack('sounds_pack', 'assets/sounds.json');
        // AHORA TODO SE CARGA EN EL PACK
   }

    create() {
        this.add.image(0, 0, 'start_background').setOrigin(0, 0).setScale(1);
        const boton_click = this.sound.add('boton_click', {volume:1});
        const boton_flecha_click = this.sound.add('boton_flecha_click', {volume:1});
        const boton_jugar = this.add.image(400, 550, "boton_jugar")
             .setInteractive()
             .on('pointerdown', () => {
                 boton_click.play();
                 this.time.delayedCall(1000, () => {
                    this.scene.stop("StartScreen");
                    this.scene.start("GameScreen");
                })
         });

        var boton_local = this.add.image(675, 400, "boton_local")
            .setInteractive()
            .on('pointerdown', () => {
                boton_click.play();
                //Por implementar cuando haya juego en red uwu
                // this.time.delayedCall(1000, () => {
                //     this.scene.stop("StartScreen");
                //     this.scene.start("EndScreen");
                // })
            });

        var boton_red = this.add.image(675, 400, "boton_en_red").setVisible(false)
            .setInteractive()
            .on('pointerdown', () => {
                boton_click.play();
                //Por implementar cuando haya juego en red uwu
                // this.time.delayedCall(1000, () => {
                //     this.scene.stop("StartScreen");
                //     this.scene.start("EndScreen");
                // })
            });
        boton_red.setDisplaySize(168, 55);
        
        const boton_flecha = this.add.image(778, 400, "boton_flecha").setScale(0.03).setRotation(3.14)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.time.delayedCall(500, () =>{
                    this.switchBoton(boton_local,boton_red)
                })    
            });
        
        const boton_flecha_2 = this.add.image(572, 400, "boton_flecha").setScale(0.03)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.time.delayedCall(500, () =>{
                    this.switchBoton(boton_local,boton_red)
                })    
            });

        const boton_ajustes = this.add.image(675, 475, "boton_ajustes").setScale(0.95)
            .setInteractive()
            .on('pointerdown', () => {
                boton_click.play();
                // this.time.delayedCall(1000, () => {
                //     this.scene.stop("StartScreen");
                //     this.scene.start("EndScreen");
                // })
            });

        const boton_creditos = this.add.image(675, 550, "boton_creditos").setScale(0.9)
            .setInteractive()
            .on('pointerdown', () => {
                boton_click.play();
                this.time.delayedCall(1000, () => {
                    this.scene.stop("StartScreen");
                    this.scene.start("CreditsScreen");
                })
        });

        this.#createAnimations();
    }


    init(data){
        this.scene.add('GameScreen', GameScreen);
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
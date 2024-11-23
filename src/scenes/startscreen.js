import { GameScreen } from "./gamescreen.js";
import { setupButton } from "../types/typedef.js";

export class StartScreen extends Phaser.Scene{
    constructor(){
        super({key: 'StartScreen'});
    }



    preload() {
        this.load.pack('image_pack', "assets/data.json");
        this.load.json('maps_pack', 'assets/maps.json');
        this.load.pack('sounds_pack', 'assets/sounds.json');
        this.cameras.main.fadeIn(500,0,0,0);
   }

    create() {
        this.add.image(0, 0, 'start_background').setOrigin(0, 0).setScale(1);

        const boton_click = this.sound.add('boton_click', {volume:1});
        const boton_flecha_click = this.sound.add('boton_flecha_click', {volume:1});


        let menuMusic = this.registry.get('menuMusic');

        if (!menuMusic) {
            // Si no existe, crearlo y guardarlo en el registro
            menuMusic = this.sound.add('menu_music', {loop:true, volume:0.5});
            menuMusic.play();
            this.registry.set('menuMusic', menuMusic);
        }

        const boton_jugar = this.add.image(400, 550, "boton_jugar").setScale(0.95);
        const boton_ajustes = this.add.image(675, 475, "boton_ajustes").setScale(0.95);
        const boton_creditos = this.add.image(675, 550, "boton_creditos").setScale(0.9);        

        setupButton(boton_jugar,()=>{
            boton_click.play();
            this.cameras.main.fadeOut(500,0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("StartScreen");
                this.scene.start("SelectScreen");
            });
               
        })

        setupButton(boton_ajustes, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500,0,0,0);
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
            this.cameras.main.fadeOut(500,0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("StartScreen");
                this.scene.start("CreditsScreen");
            });
            });
    
        var boton_local = this.add.image(675, 400, "boton_local")
            .setInteractive()
            .on('pointerdown', () => {
                boton_click.play();
            });

        var boton_red = this.add.image(675, 400, "boton_en_red").setVisible(false)
            .setInteractive()
            .on('pointerdown', () => {
                console.log("No soportado todavía");
            });

        boton_red.setDisplaySize(165, 50);
        
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

}
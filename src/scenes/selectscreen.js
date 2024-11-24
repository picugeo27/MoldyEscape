import { GameScreen } from "./gamescreen.js";
import { setupButton } from "../types/typedef.js";

export class SelectScreen extends Phaser.Scene{
    constructor(){
        super({key: 'SelectScreen'});
    }

    #selectedMap;
    #indexSelectedMap = 0;
    #mapList = []

    preload() {
        this.cameras.main.fadeIn(500,0,0,0);
        this.cache.json.get('maps_pack').preview.forEach((element) =>{
            if (!this.#mapList.includes(element.key)){
                this.load.image(element.key,element.url);
                this.#mapList.push(element.key);
            }
            
        })


   }

    create() {
        this.add.image(0, 0, 'credits_background').setOrigin(0, 0).setScale(1);

        this.add.text(115, 40, 'SELECCIONA UN NIVEL', { color: '#ffffff', fontSize: 50, stroke: '#df5fa8', strokeThickness: 4});

        const menuMusic = this.registry.get('menuMusic');

        const boton_click = this.sound.add('boton_click', {volume:1});
        const boton_flecha_click = this.sound.add('boton_flecha_click', {volume:1});
        
        const boton_jugar = this.add.image(400, 550, "boton_jugar").setScale(0.95); 
        const boton_atras = this.add.image(100, 550, "boton_volver");
        const boton_tutorial = this.add.image(680, 550, "boton_ajustes");

        this.#selectedMap = this.add.image(this.scale.width/2 , this.scale.height/2, this.#mapList[this.#indexSelectedMap]).setScale(0.6);
        
        setupButton(boton_jugar,()=>{
            boton_click.play();
            this.cameras.main.fadeOut(500,0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                menuMusic.stop();
                this.scene.stop("SelectScreen");
                this.scene.add('GameScreen', GameScreen);
                this.scene.start("GameScreen", {data: this.#indexSelectedMap});
            });
               
        })
    
        setupButton(boton_atras, () =>{
            boton_click.play();
            this.cameras.main.fadeOut(500,0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("SelectScreen");
                this.scene.start("StartScreen");
        })
    })

        setupButton(boton_tutorial, () =>{
            boton_click.play();
            this.cameras.main.fadeOut(500,0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("SelectScreen");
                this.scene.start("TutorialScreen");
        })
    })

        const boton_flecha = this.add.image(520, 550, "boton_flecha").setScale(0.03).setRotation(3.14)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.time.delayedCall(500, () =>{
                    this.nextMap()
                })    
            });
        
        const boton_flecha_2 = this.add.image(280, 550, "boton_flecha").setScale(0.03)
            .setInteractive()
            .on('pointerdown', () => {
                boton_flecha_click.play();
                this.time.delayedCall(500, () =>{
                    this.nextMap()
                })    
            });

    }

    nextMap(){
        this.#indexSelectedMap = (this.#indexSelectedMap + 1) % this.#mapList.length;
        this.#selectedMap.setTexture(this.#mapList[this.#indexSelectedMap]);
    }

}
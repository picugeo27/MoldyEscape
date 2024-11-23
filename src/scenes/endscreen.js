import { setupButton } from "../types/typedef.js";
import { GameScreen } from "./gamescreen.js";

export class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: 'EndScreen'});
    }

    //Si es true, es que la cientifica ha ganado, sino ha ganado la seta
    #playerIsWinner;
    _victorySound;
    _mapValue;

    preload(){
        this.load.image('particle', 'assets/placeholders/brillo.png');
    }

    create() {
        //Los botones tienen colores distintos espero que me perdoneis xd

        this._victorySound = this.sound.add('end_victory', {volume:1})
        this._victorySound.play();
        const arte_seta = this.add.image(0, 0, 'arte_seta').setOrigin(0, 0).setScale(0.9);
        const arte_cientifica = this.add.image(400,5, 'arte_cientifica').setOrigin(0, 0).setScale(1);

        if(this.#playerIsWinner){
            arte_seta.setTint(0x333333);
            this.add.text(35, 400, 'MONSTRUO PIERDE', { color: '#ffffff', fontSize: 30, stroke: '#df5fa8', strokeThickness: 4});
            this.add.text(460, 400, 'CIENTÍFICA GANA', { color: '#ffffff', fontSize: 30, stroke: '#df5fa8', strokeThickness: 4});
        }
        else{
            arte_cientifica.setTint(0x333333);
            this.add.text(50, 400, 'MONSTRUO GANA', { color: '#ffffff', fontSize: 30, stroke: '#df5fa8', strokeThickness: 4});
            this.add.text(450, 400, 'CIENTÍFICA PIERDE', { color: '#ffffff', fontSize: 30, stroke: '#df5fa8', strokeThickness: 4});
        }

        const boton_inicio = this.add.image(200, 550, "boton_inicio");
        setupButton(boton_inicio, () => {

            this.cameras.main.fadeOut(500,0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("EndScreen");
                this.scene.start("StartScreen");
            })
            
    });

        const boton_nueva_partida = this.add.image(400, 550, "boton_nueva_partida");
        setupButton(boton_nueva_partida, () => {
            this.cameras.main.fadeOut(500,0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("EndScreen");
                this.scene.add('GameScreen', GameScreen);
                this.scene.start("GameScreen", {data: this._mapValue});
            })
        })
            
        const boton_ajustes = this.add.image(600, 550, "boton_ajustes").setScale(0.95)
             .setInteractive()
             .on('pointerdown', () => {
                 this.scene.stop("EndScreen");
                 this.scene.start("StartScreen");
         });
        
         this.victoryParticle();
    }

    init(data){
        this.#playerIsWinner = data.playerIsWinner;
        this._mapValue = data.map;
        console.log(data.map)
    }

    victoryParticle(){
        const particleDuration = 5000;
        const emitter = this.add.particles(this.scale.width/2, this.scale.height/2,'particle',{
            angle: { min: 240, max: 300 },
            speed: { min: 200, max: 300 },
            lifespan: 3500,
            gravityY: 200,
            quantity: 2,
         })
         this.time.delayedCall(particleDuration, ()=> {
            emitter.stop();
         })
    }
}
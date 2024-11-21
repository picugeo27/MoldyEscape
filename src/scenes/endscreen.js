import { GameScreen } from "./gamescreen.js";

export class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: 'EndScreen'});
    }

    //Si es true, es que la cientifica ha ganado, sino ha ganado la seta
    #playerIsWinner;

    create() {
        //Los botones tienen colores distintos espero que me perdoneis xd

        const arte_seta = this.add.image(0, 0, 'arte_seta').setOrigin(0, 0).setScale(0.9);
        const arte_cientifica = this.add.image(400,5, 'arte_cientifica').setOrigin(0, 0).setScale(1);

        if(this.#playerIsWinner){
            arte_seta.setTint(0x333333);
        }
        else{
            arte_cientifica.setTint(0x333333);
        }

        const game_over_text = this.add.text(225, 50, 'Game Over', { color: '#ffffff', fontSize: 70, stroke: '#df5fa8', strokeThickness: 4});
        const extra_text = this.add.text(270, 150, 'Try Again!', { color: '#ffffff', fontSize: 55, stroke: '#df5fa8', strokeThickness: 4});
        const boton_inicio = this.add.image(200, 550, "boton_inicio")
             .setInteractive()
             .on('pointerdown', () => {
                 this.scene.stop("EndScreen");
                 this.scene.start("StartScreen");
         });
        const boton_nueva_partida = this.add.image(400, 550, "boton_nueva_partida")
             .setInteractive()
             .on('pointerdown', () => {
                 this.scene.stop("EndScreen");
                 this.scene.add('GameScreen', GameScreen);
                 this.scene.start("GameScreen");
         });
        const boton_ajustes = this.add.image(600, 550, "boton_ajustes").setScale(0.95)
             .setInteractive()
             .on('pointerdown', () => {
                 this.scene.stop("EndScreen");
                 this.scene.start("StartScreen");
         });
        
    }

    // Para reiniciar la escena GAME
    ///**@param {boolean} data */
    init(data){
        console.log('se recibe: ', data)
        //data.scene.add('GameScreen', GameScreen);
        this.#playerIsWinner = data.playerIsWinner;
    }

    update() {}

}
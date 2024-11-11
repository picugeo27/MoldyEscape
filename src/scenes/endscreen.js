export class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: 'EndScreen'});
    }

    create() {
        //Los botones tienen colores distintos espero que me perdoneis xd

        //this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1);
        const game_over_text = this.add.text(225, 50, 'Game Over', { color: '#ffffff', fontSize: 70, stroke: '#df5fa8', strokeThickness: 4});
        const extra_text = this.add.text(270, 150, 'Try Again!', { color: '#ffffff', fontSize: 55, stroke: '#df5fa8', strokeThickness: 4});
        const boton_inicio = this.add.image(200, 550, "boton_inicio")
             .setInteractive()
             .on('pointerdown', () => {
                 this.scene.stop("EndScreen");
                 this.scene.start("StartScreen");
         });
        const boton_nueva_partida = this.add.image(400, 550, "boton_nueva_partida");
        const boton_ajustes = this.add.image(600, 550, "boton_ajustes").setScale(0.95);
        
    }

    update() {}

}
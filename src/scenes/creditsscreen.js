import { SIZE_CANVAS } from "../types/typedef.js";
import { GameScreen } from "./gamescreen.js";

export class CreditsScreen extends Phaser.Scene{
    constructor(){
        super({key: 'CreditsScreen'});
    }

    create() {
        //Creación del background
        const background = this.add.image(0, 0, 'credits_background').setOrigin(0, 0).setScale(1);
        const boton_click = this.sound.add('boton_click', {volume:1});
        // Crear un rectángulo semi-transparente encima de la imagen
        //const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5);

        const credits_text = this.add.text(300, 20, 'CRÉDITOS', { color: '#ffffff', fontSize: 50, stroke: '#df5fa8', strokeThickness: 4});

         // Datos de la lista
        const items = [
            "Blanca García Vera",
            "George Picu Hordoan",
            "Unai Retes Corada",
            "Candela Jiménez González"
        ];

        // Posición inicial para el texto
        const startX = 80;
        const startY = 100;
        const lineHeight = 50; // Espacio entre líneas

        //Crear cuadro para que al pulsar un nombre de la lista, aparezca el rol de cada uno
        // Borde del contenedor
        const border = this.add.rectangle(this.scale.width / 2, 400, 620, 100, 0xdf5fa8); // Más grande que el relleno
        // Contenedor para el mensaje
        const messageBox = this.add.rectangle(
            this.scale.width / 2, // Centro en X
            400, //Centro en y
            600, // Dimensiones en x
            80,  //Dimensiones en y
            0xffffff
        ).setOrigin(0.5); // Centrar el rectángulo

        const messageText = this.add.text(this.scale.width / 2, 400, "",
            {
                color: '#000000',
                fontSize: 24,
                align: 'center'
            }
        ).setOrigin(0.5); // Centrar el texto

        // Ocultar el mensaje inicialmente
        border.setVisible(false);
        messageBox.setVisible(false);
        messageText.setVisible(false);

        // Crear cada línea de texto
        items.forEach((item, index) => {
            const text = this.add.text(startX, startY + index * lineHeight, item,
                { color: '#ffffff', fontSize: 40, stroke: '#df5fa8', strokeThickness: 4})
            .setInteractive()
            text.on('pointerover', () => text.setStyle({ stroke: '#f39c12' }))
            text.on('pointerout', () => text.setStyle({ stroke: '#df5fa8' }))
            text.on('pointerdown', () => {
                // Mostrar el mensaje
                border.setVisible(true);
                messageBox.setVisible(true);
                messageText.setVisible(true);

                // Actualizar el texto con el elemento seleccionado
                //messageText.setText(`Has seleccionado: ${item}`);

                switch(item){
                    case("Blanca García Vera"):
                        messageText.setText("Blanca");
                        break;
                    case("George Picu Hordoan"):
                        messageText.setText("George");
                        break;
                    case("Unai Retes Corada"):
                        messageText.setText("Unai");
                        break;
                    case("Candela Jiménez González"):
                        messageText.setText("Candela");
                        break;
                    default:
                        messageText.setText("Profe merecemos un 10");
                }
            });
        });
        
        const boton_inicio = this.add.image(400, 550, "boton_inicio")
             .setInteractive()
             .on('pointerdown', () => {
                boton_click.play();
                this.time.delayedCall(1000, () => {
                    this.scene.stop("CreditsScreen");
                    this.scene.start("StartScreen");
                })
            });
        
    }

    update() {}

}
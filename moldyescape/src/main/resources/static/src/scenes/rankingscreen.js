import { setupButton } from "../types/typedef.js";

export class RankingScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'RankingScreen' });
    }

    //Lista con el ranking
    _rankingList;

    //Variables del cuadro de texto
    border;
    messageBox;
    messageText;

    //Sonidos
    boton_hover;
    boton_click;

    async preload() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        await this.getRankedUsers();
    }

    async create() {
        this.boton_click = this.sound.add('boton_click', { volume: 1 });
        this.boton_hover = this.sound.add('boton_hover', { volume: 1 });

        this.add.text(200, 30, 'RANKING TOP 5', { color: '#ffffff', fontSize: 50, fontStyle: 'bold', stroke: '#df5fa8', strokeThickness: 4 });
        // Posición inicial para el texto
        // Espacio entre líneas

        //Crear cuadro para que al pulsar un nombre de la lista, aparezca el rol de cada uno
        // Borde del contenedor
        this.border = this.add.rectangle(this.scale.width / 2, 440, 620, 100, 0xdf5fa8); // Más grande que el relleno
        // Contenedor para el mensaje
        this.messageBox = this.add.rectangle(
            this.scale.width / 2, // Centro en X
            440, //Centro en y
            600, // Dimensiones en x
            80,  //Dimensiones en y
            0xffffff
        ).setOrigin(0.5); // Centrar el rectángulo

        this.messageText = this.add.text(this.scale.width / 2, 440, "",
            {
                color: '#000000',
                fontSize: 24,
                align: 'center'
            }
        ).setOrigin(0.5); // Centrar el texto

        // Ocultar el mensaje inicialmente
        this.border.setVisible(false);
        this.messageBox.setVisible(false);
        this.messageText.setVisible(false);



        const boton_atras = this.add.image(400, 550, "boton_volver");
        setupButton(boton_atras, () => {
            this.boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("RankingScreen");
                this.scene.start("StartScreen");
            })
        });
    }

    async getRankedUsers() {

        $.ajax({
            method: "GET",
            url: "/users/getranking"
        }).done((data) => {
            this.connectedUsersSet = data;
            this.connectedUsers = Array.from(this.connectedUsersSet);
            this._rankingList = this.connectedUsers;

            const startX = 300;
            const startY = 115;
            const lineHeight = 40;

            this.showRanking(startX, startY, lineHeight);

        }).fail(function (data, message) {
            console.log(message);
        })

    }

    showRanking(startX, startY, lineHeight) {
        // Crear cada línea de texto
        this._rankingList.forEach((item, index) => {
            var colorCode;
            switch (index) {
                case 0:
                    colorCode = '#AF9C0A';
                    break;
                case 1:
                    colorCode = '#C8C8C7';
                    break;
                case 2:
                    colorCode = '#984C00';
                    break;
                default:
                    colorCode = '#df5fa8';
                    break;
            }
            const text = this.add.text(startX, startY + index * lineHeight, index + 1 + "º " + item,
                { color: '#ffffff', fontSize: 32, stroke: colorCode, strokeThickness: 4 })
                .setInteractive()
                .on('pointerover', () => {
                    this.boton_hover.play();
                });
            text.on('pointerover', () => text.setStyle({ stroke: '#f39c12' }))
            text.on('pointerout', () => text.setStyle({ stroke: colorCode }))
            text.on('pointerdown', async () => {

                const data = await new Promise((resolve, reject) => {
                    $.ajax({
                        method: "GET",
                        url: "/users/getwins?username=" + item,
                        success: resolve,
                        error: reject
                    });
                });
                this.messageText.text = "Número de partidas ganadas: " + data;
                // Mostrar el mensaje
                this.border.setVisible(true);
                this.messageBox.setVisible(true);
                this.messageText.visible = true;


            });
        });

        const playerText = this.add.text(125, 330, "Usuario conectado: " + connectedUser.username, { color: '#ffffff', fontSize: 32, stroke: '#3A5FCE', strokeThickness: 4 }).setInteractive()
            .on('pointerover', () => {
                this.boton_hover.play();
            });
        playerText.on('pointerover', () => playerText.setStyle({ stroke: '#f39c12' }))
        playerText.on('pointerout', () => playerText.setStyle({ stroke: "3A5FCE" }))
            .on('pointerdown', async () => {

                const data = await new Promise((resolve, reject) => {
                    $.ajax({
                        method: "GET",
                        url: "/users/getwins?username=" + connectedUser.username,
                        success: resolve,
                        error: reject
                    });
                });
                this.messageText.text = "Número de partidas ganadas: " + data;
                // Mostrar el mensaje
                this.border.setVisible(true);
                this.messageBox.setVisible(true);
                this.messageText.visible = true;
                ;

            })
    }
}
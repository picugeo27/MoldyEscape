
    export class UsersOverlay extends Phaser.Scene {
        constructor() {
            super({ key: 'UsersOverlay'});
        }
        
        //Texto del pop-up
        _statsText = [];
        maxUsersOverlay = 13;
        _currentPage = 0; // Página actual
        _usersPerPage = 5; // Usuarios por página
        prevButton;
        nextButton;
        preload() {
        }

        create() {
            //Conjunto de usuarios conectados, luego tiene que cogerse el conjunto de usuarios conectados (mas bien sus usernames) con una peticion GET.
            var connectedUsersSet = new Set(["Blanca", "Unai", "Candela", "George", "Paloma", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"]);
   
            // Crear un fondo semi-transparente
            this.overlay = this.add.rectangle(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                this.cameras.main.width * 0.8,
                this.cameras.main.height * 0.6,
                0x000000,
                0.6 // Opacidad
            );
            this.overlay.setOrigin(0.5, 0.5);
            this.overlay.setVisible(false);

            // Añadir usuarios al texto que se mostrará en el overlay por pantalla
            this.showConnectedUsers(Array.from(connectedUsersSet));


            this.prevButton = this.add.image(this.cameras.main.centerX - 100,
                this.cameras.main.centerY + 100, "boton_flecha").setScale(0.9);
            this.prevButton.flipX = true;
            this.prevButton.setInteractive().setVisible(false);
                // .on('pointerdown', () => {
                //     //boton_flecha_click.play();
                //     this.time.delayedCall(500, () =>{
                        
                //     })    
                // });
        
            this.nextButton = this.add.image(this.cameras.main.centerX + 100, 
                this.cameras.main.centerY + 100, "boton_flecha").setScale(0.9);
            this.nextButton.setInteractive().setVisible(false);
                // .setInteractive()
                // .on('pointerdown', () => {
                //     //boton_flecha_click.play();
                //     this.time.delayedCall(500, () =>{
                        
                //     })    
                // });

            // Mostrar y ocultar
            this.input.keyboard.on('keydown-SPACE', () => { 
                if(this.overlay.visible){
                    this.toggleOverlay(false);
                }
                else{
                    this.toggleOverlay(true);
                }
            });
            
        }


        toggleOverlay(show) {
            this.overlay.setVisible(show);
            // if (this._statsText) {
            //     this._statsText.forEach(text => {
            //         text.setVisible(!text.visible);
            //     });
            // }
            this._statsText.forEach(text => text.setVisible(show));
            this.prevButton.setVisible(show);
            this.nextButton.setVisible(show);
        }

        //Metodo para coger la lista de usernames y mostrarlos en el pop-up al pulsar espacio
        showConnectedUsers(connectedUsers){
            //console.log(connectedUsers);
            for(var index = 0; index < this.maxUsersOverlay; index += 1){
                const aux = this.add.text(100, 135 + index * 26, connectedUsers[index],
                    { fontSize: '20px', color: '#ffffff', align: 'center' }).setVisible(false);
                    this._statsText.push(aux);
            }
            // connectedUsers.forEach((user, index) => {
            //     const aux = this.add.text(100, 135 + index * 25, user,
            //     { fontSize: '20px', color: '#ffffff', align: 'center' }).setVisible(false);
            //     this._statsText.push(aux);
            //     if(index >= 12){
            //         return false;
            //     }
            // })
            console.log(this._statsText);
        }

    }

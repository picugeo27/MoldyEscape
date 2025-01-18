
export class UsersOverlay extends Phaser.Scene {
    constructor() {
        super({ key: 'UsersOverlay' });
    }

    //Texto del pop-up
    _statsText = [];
    intervalo;
    _currentPage = 0; // Página actual
    _usersPerPage = 5; // Usuarios por página
    _maxPages;
    connectedUsersSet;
    connectedUsers;
    preload() {

    }

    async create() {
        this.scene.bringToTop();

        this.connectedUsersSet = new Set();
        this.connectedUsers = [];

        // Crear un fondo semi-transparente
        this.overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width * 0.8,
            this.cameras.main.height * 0.6,
            0x000000,
            0.8 // Opacidad
        );
        this.overlay.setOrigin(0.5, 0.5);
        this.overlay.setVisible(false);

        this.leftArrowButton = this.add.image(this.cameras.main.centerX - 250, this.cameras.main.centerY, "boton_flecha").setScale(0.9);
        this.leftArrowButton.setInteractive().setVisible(false)
            .on('pointerdown', () => {
                this.changePages(0);
            });

        this.rightArrowButton = this.add.image(this.cameras.main.centerX + 250, this.cameras.main.centerY, "boton_flecha").setScale(0.9)
        this.rightArrowButton.flipX = true;
        this.rightArrowButton.setInteractive().setVisible(false)
            .on('pointerdown', () => {
                this.changePages(1);
            });


        this.overlayKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        
        // Mostrar y ocultar
        // this.input.keyboard.on('keydown-TAB', () => {
        //     if (this.overlay.visible) {
        //         this.toggleOverlay(false);
        //     }
        //     else {
        //         this.toggleOverlay(true);
        //     }
        // });

        await this.getConnectedUsers();

        this.intervalo = setInterval(() => this.getConnectedUsers(), 10 * 1000);
    }

    update()
    {
        if (Phaser.Input.Keyboard.JustDown(this.overlayKey)) {
            if (this.overlay.visible) {
                this.toggleOverlay(false);
            }
            else {
                this.toggleOverlay(true);
            }
        }
    }

    toggleOverlay(show) {
        this.overlay.setVisible(show);
        if (this._statsText) {
            this._statsText.forEach(text => {
                text.setVisible(!text.visible);
            });
        }
        this.leftArrowButton.setVisible(show);
        this.rightArrowButton.setVisible(show);
        if (this._currentPage === 0) {
            this.leftArrowButton.setVisible(false);
        }
        if (this._currentPage === this._maxPages - 1) {
            this.rightArrowButton.setVisible(false);
        }
    }

    changePages(index) {
        //index === 1 para moverse a la derecha, index === 0 para la izquierda
        if (index === 1) {
            this._currentPage += 1;
            this.showConnectedUsers();
        }
        else if (index === 0) {
            this._currentPage -= 1;
            this.showConnectedUsers();
        }
    }


    //Metodo para coger la lista de usernames y mostrarlos en el pop-up al pulsar espacio
    showConnectedUsers() {
        this._statsText.forEach(text => text.destroy());
        this._statsText = [];
        var start = this._currentPage * this._usersPerPage;
        var end = start + this._usersPerPage;

        var toShow = this.connectedUsers.slice(start, end);

        for (var index = 0; index < this._usersPerPage; index += 1) {
            const aux = this.add.text(325, 175 + index * 50, toShow[index],
                { fontSize: '40px', color: '#ffffff', align: 'center' })//.setVisible(false);
            this._statsText.push(aux);
        }
        this.updateButtons();
    }


    updateButtons() {
        this.leftArrowButton.setVisible(this._currentPage > 0 && this.overlay.visible);
        this.rightArrowButton.setVisible(this._currentPage < this._maxPages - 1 && this.overlay.visible);
    }

    async getConnectedUsers() {
        $.ajax({
            method: "GET",
            url: "/users/connectedusers"
        }).done((data) => {
            this.connectedUsersSet = data;
            this.connectedUsers = Array.from(this.connectedUsersSet);
            this._maxPages = Math.ceil(this.connectedUsers.length / this._usersPerPage);
            this.showConnectedUsers();
            this.hideTexts();
        }).fail(function (data, message) {
            console.log(message);
        })

    }

    hideTexts() {
        if (this._statsText && !this.overlay.visible) {
            this._statsText.forEach(text => {
                text.setVisible(!text.visible);
            });
        }
    }

}

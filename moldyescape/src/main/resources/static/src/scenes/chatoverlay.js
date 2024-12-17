
export class ChatOverlay extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatOverlay' });
    }

    //Texto del pop-up
    _statsText = [];
    intervalo;
    //maxUsersOverlay = 13;
    _currentPage = 0; // Página actual
    _usersPerPage = 5; // Usuarios por página
    _maxPages;
    messagesSet;
    messages;
    preload() {

    }

    async create() {
        //Conjunto de usuarios conectados, luego tiene que cogerse el conjunto de usuarios conectados (mas bien sus usernames) con una peticion GET.
        //var connectedUsersSet = new Set(["Blanca", "Unai", "Candela", "George", "Paloma", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"]);
        var messagesSet = new Set(["Blanca", "Unai", "Candela", "George", "Paloma", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"]);
        this.messagesSet = new Set();
        this.messages= [];

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


        // Mostrar y ocultar
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.overlay.visible) {
                this.toggleOverlay(false);
            }
            else {
                this.toggleOverlay(true);
            }
        });

        await this.getMessages();

        this.intervalo = setInterval(() => this.getMessages(), 10 * 1000);
    }

    toggleOverlay(show) {
        this.overlay.setVisible(show);
        if (this._statsText) {
            this._statsText.forEach(text => {
                text.setVisible(!text.visible);
            });
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

        var toShow = this.messages.slice(start, end);

        for (var index = 0; index < this._usersPerPage; index += 1) {
            const aux = this.add.text(325, 175 + index * 50, toShow[index],
                { fontSize: '40px', color: '#ffffff', align: 'center' })//.setVisible(false);
            this._statsText.push(aux);
        }

        //Código para lista que se corta
        //console.log(connectedUsers);
        // for(var index = 0; index < this.maxUsersOverlay; index += 1){
        //     const aux = this.add.text(100, 135 + index * 26, connectedUsers[index],
        //         { fontSize: '20px', color: '#ffffff', align: 'center' }).setVisible(false);
        //         this._statsText.push(aux);
        // }
    }



    async getMessages() {

        //$.ajax({
        //    method: "GET",
        //    url: "http://localhost:8080/users/connectedusers"
        //}).done((data) => {
        //    this.connectedUsersSet = data;
        //    this.connectedUsers = Array.from(this.connectedUsersSet);
        //    this._maxPages = Math.ceil(this.connectedUsers.length / this._usersPerPage);
        //    this.showConnectedUsers();
        //    this.hideTexts();
        //}).fail(function (data, message) {
        //    console.log(message);
        //})

    }

    hideTexts() {
        if (this._statsText && !this.overlay.visible) {
            this._statsText.forEach(text => {
                text.setVisible(!text.visible);
            });
        }
    }

}


export class ChatOverlay extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatOverlay' });
    }

    //Variables para mensajes
    messages = [];
    _statsText = [];
    overlay;

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
            0x000000, 0.6 // Opacidad
        ).setOrigin(0.5).setVisible(false);


        // Mostrar y ocultar
        this.input.keyboard.on('keydown-ENTER', () => {
            this.toggleOverlay(!this.overlay.visible);
        });

        this.setupHTMLListeners();
  
    }

    toggleOverlay(show) {
        this.overlay.setVisible(show);
        this._statsText.forEach(text => text.setVisible(show));
    }

     // Configurar los listeners del input HTML
     setupHTMLListeners() {
        const inputElement = document.getElementById('message');
        const sendButton = document.getElementById('sendButton');

        // Evento al hacer clic en "Enviar"
        sendButton.addEventListener('click', () => this.sendMessage(inputElement));

        // Evento al presionar Enter en el input
        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Evita recargar la página
                this.sendMessage(inputElement);
            }
        });
    }

    // Enviar un mensaje al sistema
    sendMessage(inputElement) {
        const newMessage = inputElement.value.trim();

        if (newMessage) {
            this.messages.push(newMessage); // Agregar al array de mensajes
            inputElement.value = ''; // Limpiar input
            this.showMessages(); // Actualizar la vista en Phaser
        }
    }

    // Mostrar los mensajes en pantalla
    showMessages() {
        // Limpiar textos anteriores
        this._statsText.forEach(text => text.destroy());
        this._statsText = [];

        // Mostrar cada mensaje en pantalla
        this.messages.forEach((msg, index) => {
            const text = this.add.text(50, 150 + index * 30, msg, {
                fontSize: '20px', color: '#ffffff'
            });
            this._statsText.push(text);
        });
    }
}



import { setupButton } from "../types/typedef.js";

export class ChatScreen extends Phaser.Scene {
	constructor() {
		super({ key: 'ChatScreen' });
	}

	menuBackground = {};
	botonSalir = {};
	ForumChat = {};
	messages_box_div = null;

	accumulated_time = 0;
	seconds_per_petition = 2;

	preload() {
		this.load.html('chat', 'assets/chat.html');
		this.cameras.main.fadeIn(500, 0, 0, 0);
	}

	create() {
		// Añadir el background a la escena.
		this.menuBackground = this.add.image(0, 0, 'start_background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

		this.input.keyboard.manager.enabled = false;
		console.log(this.input.keyboard);
		this.accumulated_time = 0;

		const element = this.add.dom(this.scale.width / 2, this.scale.height / 2).createFromCache('chat');
		this.ForumChat = element;

		this.messages_box_div = element.node.querySelector('#forum-messages-box');

		let that = this;
		element.setPerspective(800);
		element.addListener('click');
		element.on('click', function (event) {

			//Botón de Enviar pulsado.
			if (event.target.name === 'send-message') {

				let msg_input_box = this.getChildByName('message-input');
				let mensaje = msg_input_box.value;
				msg_input_box.value = "";

				if (mensaje !== '') {
					//Si hay mensaje, enviarlo por petición AJAX.
					$.ajax({
						method: "POST",
						url: "/chat/envio",
						data: mensaje + "<br>",
						processData: false,
						headers: {
							"username": connectedUser.username,
							"Content-type": "application/json"
						}
					}).done(function (data, textStatus, jqXHR) {
						console.log("El mensaje se ha añadido satisfactoriamente al servidor.");
						that.addMessage(mensaje);
						that.scrollChat();
					}).fail(function (data, textStatus, jqXHR) {
						console.log("Error, no se ha añadido el mensaje al servidor.");
					});
				}
			}

		});

		this.getMessages(true);


		// Botón para volver a la pantalla de inicio startscreen.
		const boton_volver = this.add.image(400, 550, "boton_volver");

		setupButton(boton_volver, () => {
			this.cameras.main.fadeOut(500, 0, 0, 0);
			this.cameras.main.once('camerafadeoutcomplete', () => {
				this.scene.stop("ChatScreen");
				this.scene.start("StartScreen");
			});

		})
	}

	update(time, delta) {
		if (this.accumulated_time > 1000 * this.seconds_per_petition) {
			this.getMessages(this.shouldScroll());
			this.accumulated_time = 0;
		}
		this.accumulated_time += delta;
	}

	setMessages(message_string) {
		var aux = "";
		message_string.forEach(element => {
			aux += element;
		});
		this.messages_box_div.innerHTML = aux;
	}

	addMessage(message_string) {
		this.messages_box_div.innerHTML += message_string;
	}

	scrollChat() {
		this.messages_box_div.scrollTop = this.messages_box_div.scrollHeight;
	}

	shouldScroll() {
		const threshold = 150;
		var remainingSpace = this.messages_box_div.scrollHeight - this.messages_box_div.scrollTop - this.messages_box_div.clientHeight;
		return remainingSpace < threshold;
	}

	getMessages(should_scroll) {
		var that = this;

		$.ajax({
			url: '/chat',
			method: 'GET',
			processData: false,
			headers: {
				"Content-type": "application/json"
			}
		}).done(function (data, status, xhr) {
			that.setMessages(data);
			if (should_scroll) {
				that.scrollChat();
			}

		}).fail((data) => {
			console.log(data);
		});

	};
}
import { popUpText } from "../types/typedef.js";

const LOGIN_ERROR = "Los datos no coinciden";
const LOGIN_INCOMPLETE = "Por favor, rellena todos los campos";
const REGISTER_ERROR = "Ya hay un usuario con ese nombre";

const POPUP_TIME = 2000;
const POPUP_OFFSET = -220;

let currentScene;

export class LoginScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScreen' });
    }

    preload() {
        this.load.pack('image_pack', "assets/data.json");
        this.load.json('maps_pack', 'assets/maps.json');
        this.load.pack('sounds_pack', 'assets/sounds.json');
        this.load.html('loginform', 'assets/loginform.html');
        this.cameras.main.fadeIn(500, 0, 0, 0);

    }

    create() {
        this.input.keyboard.manager.enabled = false;

        currentScene = this;
        this.add.image(0, 0, 'credits_background').setOrigin(0, 0).setScale(0.17);
        const boton_click = this.sound.add('boton_click', { volume: 1 });

        //Login form

        const text = this.add.text(10, 10, 'Registrate o inicia sesión para jugar', { color: 'white', fontFamily: 'Arial', fontSize: '20px ' });

        const element = this.add.dom(300, 250).createFromCache('loginform');

        element.setPerspective(800);
        element.addListener('click');

        element.on('click', (event) => {
            // @ts-ignore
            const inputUsername = element.getChildByName('username').value;
            // @ts-ignore
            const inputPassword = element.getChildByName('password').value;

            if (event.target.name === 'loginButton') {

                if (inputUsername !== '' && inputPassword !== '') {

                    $.ajax({
                        method: "POST",
                        url: "/users/login?username=" + inputUsername + "&password=" + inputPassword,

                    })
                        .done(() => {

                            //  Populate the text with whatever they typed in as the username!
                            text.setText(`Bienvenido de nuevo ${inputUsername}`);
                            element.setVisible(false); // Esconde el formulario

                            this.loginExitoso(inputUsername);

                        })
                        .fail(function () {
                            popUpText(currentScene, LOGIN_ERROR, POPUP_TIME, POPUP_OFFSET);
                            console.log("Login rechazado");
                        });
                }
                else {
                    popUpText(currentScene, LOGIN_INCOMPLETE, POPUP_TIME, POPUP_OFFSET);
                    text.setText('Inicio de sesión inválido');
                }
            } else if (event.target.name === 'registerButton') {
                // Lógica de registro
                if (inputUsername !== '' && inputPassword !== '') {
                    const requestBody = {
                        username: inputUsername,
                        password: inputPassword,
                    };

                    $.ajax({
                        method: "POST",
                        url: "/users/register",
                        data: JSON.stringify({ username: inputUsername, password: inputPassword }),
                        processData: false,
                        headers: {
                            "Content-type": "application/json"
                        }
                    }).done(() => {
                        this.loginExitoso(inputUsername);
                    })
                        .fail(function (data) {
                            popUpText(currentScene, REGISTER_ERROR, POPUP_TIME, POPUP_OFFSET);
                            text.setText("Este usuario ya existe");
                        });


                }
            } else if (event.target.name === 'offlineButton') {
                this.changeScreen();
            } else {
                text.setText('Rellene todos los campos');
            }
        }
        );
    }

    loginExitoso(username) {
        connectedUser.logIn(username);

        if (connectedUser.username != null) {
            // Realiza una solicitud AJAX para mantener la conexión activa
            $.ajax({
                method: "POST",
                url: "/users/keepalive/" + connectedUser.username,

            })
                .done(function (data, textStatus, jqXHR) {
                    console.log("Keepalive success: " + textStatus + " " + jqXHR.status);
                })
                .fail(function () {
                    console.error("Keepalive error");
                });
        } else {
            console.log("No connected user. Keepalive not sent.");
        }

        this.changeScreen();
    }

    changeScreen() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop("LoginScreen");
            this.scene.start("StartScreen");
        })
    }
}
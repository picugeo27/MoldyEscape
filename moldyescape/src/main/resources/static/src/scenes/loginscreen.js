import { setupButton } from "../types/typedef.js";

//Cargar fuente con FontFace
//const font = new FontFace('Press Start 2P', 'url(https://fonts.gstatic.com/s/pressstart2p/v13/e3t4euGpGgyyPJc5ITeoYDkUeypByx0.ttf)');

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
        this.add.image(0, 0, 'credits_background').setOrigin(0, 0).setScale(1);
        const boton_click = this.sound.add('boton_click', { volume: 1 });

        const boton_atras = this.add.image(400, 550, "boton_volver");
        setupButton(boton_atras, () => {
            boton_click.play();
        });



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
            console.log(inputUsername)

            if (event.target.name === 'loginButton') {

                
                if (inputUsername !== '' && inputPassword !== '') {

                    $.ajax({
                        method: "POST",
                        url: "http://localhost:8080/users/login?username=" + inputUsername + "&password=" + inputPassword,

                    })
                        .done(() => {

                            //  Populate the text with whatever they typed in as the username!
                            text.setText(`Bienvenido ${inputUsername}`);
                            element.setVisible(false); // Esconde el formulario

                            this.loginExitoso(inputUsername);

                        })
                        .fail(function () {
                            console.log("Login rechazado");
                        });
                }
                else {

                    text.setText('Inicio de sesión inválido');
                }
                        }else if (event.target.name === 'registerButton') {
                            // Lógica de registro
                            if (inputUsername !== '' && inputPassword !== '') {
                                const requestBody = {
                                    username: inputUsername,
                                    password: inputPassword,
                                };
            
                                fetch('http://localhost:8080/users/register', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(requestBody), // Enviamos los datos
                                })
                                    .then((response) => {
                                        if (response.ok) {
                                            text.setText('Registro completo');
                                            element.setVisible(false); // Esconde el formulario

                                            this.cameras.main.fadeOut(500, 0, 0, 0);
                                    this.cameras.main.once('camerafadeoutcomplete', () => {
                                        this.scene.stop("LoginScreen");
                                        this.scene.start("StartScreen");
                                     })
                                    
                                    } else {
                                            text.setText('Ya hay un usuario con este nombre');
                                        }
                                    })
                                    .catch((error) => {
                                        text.setText('Error durante el registro');
                                        console.error(error);
                                    });
                            } else {
                                text.setText('Rellene todos los campos');
                            }
                        }
                    });
                }

    loginExitoso(username) {
        connectedUser.logIn(username);

        console.log("keep alive")
        if (connectedUser.username != null) {
            // Realiza una solicitud AJAX para mantener la conexión activa
            $.ajax({
                method: "POST",
                url: "http://localhost:8080/users/keepalive/" + connectedUser.username,

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

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop("LoginScreen");
            this.scene.start("StartScreen");
        })
    }

}
import { setupButton } from "../types/typedef.js";

export class LoginScreen extends Phaser.Scene{
    constructor(){
        super({key: 'LoginScreen'});
    }


    preload(){
        this.load.pack('image_pack', "assets/data.json");
        this.load.json('maps_pack', 'assets/maps.json');
        this.load.pack('sounds_pack', 'assets/sounds.json');
        this.load.html('loginform', 'assets/loginform.html');
        //this.load.html('loginform', 'assets/formulario.html');
        this.cameras.main.fadeIn(500,0,0,0);
    }

    create(){
        this.add.image(0, 0, 'credits_background').setOrigin(0, 0).setScale(1);
        const boton_click = this.sound.add('boton_click', {volume:1});

        const boton_atras = this.add.image(400, 550, "boton_volver");
        setupButton(boton_atras, () => {
            boton_click.play();
            connectedUser.logIn("Paco");
            this.cameras.main.fadeOut(500,0,0,0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("LoginScreen");
                this.scene.start("StartScreen");
            })
        });


        //Login form

        const text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});

        const element = this.add.dom(300, 250).createFromCache('loginform');

        element.setPerspective(800);
        element.addListener('click');
        
        element.on('click', function (event)
        {

            if (event.target.name === 'loginButton')
            {
                const inputUsername = this.getChildByName('username');
                const inputPassword = this.getChildByName('password');

                //  Have they entered anything?
                if (inputUsername.value !== '' && inputPassword.value !== '')
                {
                    //  Turn off the click events
                    this.removeListener('click');

                    //  Populate the text with whatever they typed in as the username!
                    //text.setText(`Welcome ${inputUsername.value}`);
                    text.setText('Welcome');
                    element.setVisible(false); // Esconde el formulario
                }
                else
                {

                    text.setText('Wrong');
                }
            }

        });

        
    }


}
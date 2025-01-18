import { setupButton } from "../types/typedef.js";

export class SettingsScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScreen' });
    }

    preload() {

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    create() {

        //Sonidos
        const boton_click = this.sound.add('boton_click', { volume: 1 });


        // Crear un rectángulo semi-transparente encima de la imagen
        const overlay = this.add.rectangle(630, 550, 360, 160, 0x000000, 0.5);

        this.add.text(300, 40, 'AJUSTES', {
            color: '#ffffff',
            fontSize: 50,
            stroke: '#df5fa8',
            strokeThickness: 4,
        });

        this.add.text(460, 490, 'IMPORTANTE\n Los cambios en los ajustes\n se guardan\nautomáticamente\n durante la misma sesión\n',
            { color: '#ffffff', fontSize: 20, stroke: '#df5fa8', align: 'center' });//, strokeThickness: 4});


        let menuMusic = this.registry.get('menuMusic');
        if (!menuMusic) {
            // Si no existe, crearlo y guardarlo en el registro
            menuMusic = this.sound.add('menu_music', { loop: true, volume: 0.5 });
            menuMusic.play();
            this.registry.set('menuMusic', menuMusic);
        }

        const sliderX = 400; // Posición x del slider
        const sliderY = 200; // Posición Y del slider
        const sliderWidth = 400; // Ancho del slider
        const sliderHeight = 30; // Alto del slider

        this.add.image(125, 170, 'altavoz_mute').setOrigin(0, 0).setScale(0.05);
        this.add.image(615, 170, 'altavoz').setOrigin(0, 0).setScale(0.06);

        // Barra del slider
        const sliderBar = this.add.rectangle(sliderX, sliderY, sliderWidth, sliderHeight, 0xaaaaaa);

        // Handler del slider
        const handle = this.add.rectangle(sliderX, sliderY, 40, 40, 0xdf5fa8).setInteractive();

        // Texto con el porcentaje del volumen
        const volumeText = this.add.text(320, sliderY - 50, 'Volumen: 50%', { color: '#ffffff', fontSize: '24px', stroke: '#df5fa8', strokeThickness: 4 });


        //El datamanager de Phaser (registry) almacena la configuración del volumen y la mantiene durante la sesión de juego
        //Vaya que si se aumenta el volumen ese cambio se guarda y se mantiene hasta que refresques la pestaña

        // Inicializa el data manager con un volumen del 50% si no está inicializado
        if (!this.registry.has('volume')) {
            this.registry.set('volume', 0.5);
        }

        // El volumen es igual al que hay en el datamanager
        const volume = this.registry.get('volume');

        // Posición inicial del handle
        const minX = sliderX - sliderWidth / 2;
        const maxX = sliderX + sliderWidth / 2;
        handle.x = minX + volume * sliderWidth;
        this.sound.volume = volume;
        volumeText.setText(`Volumen: ${(volume * 100).toFixed(0)}%`);

        this.input.setDraggable(handle); //Hacer que se pueda deslizar el handler por la barra


        this.input.on('drag', (pointer, gameObject, dragX) => { //Al deslizar el handle, se cambia el volumen y se almacena en el datamanager
            if (gameObject === handle) {
                handle.x = Phaser.Math.Clamp(dragX, minX, maxX);
                const newVolume = (handle.x - minX) / sliderWidth;
                this.sound.volume = newVolume;
                this.registry.set('volume', newVolume);
                volumeText.setText(`Volumen: ${(newVolume * 100).toFixed(0)}%`);
            }
        });


        const boton_full_screen = this.add.image(400, 300, "boton_fullscreen");
        const boton_tutorial = this.add.image(400, 360, "boton_tutorial");
        const boton_borrar_usuario = this.add.image(400, 420, "boton_borrar_usuario");
        const boton_atras = this.add.image(200, 550, "boton_volver");
        



        setupButton(boton_full_screen, () => {
            boton_click.play();
            this.time.delayedCall(1000, () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                }
                else {
                    this.scale.startFullscreen();
                }
            })
        });


        setupButton(boton_atras, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("SettingsScreen");
                this.scene.start("StartScreen");
            });
        });

        setupButton(boton_tutorial, () => {
            boton_click.play();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("SettingsScreen");
                this.scene.start("TutorialScreen", { previousScreen: 'SettingsScreen' });
            });
        });

        setupButton(boton_borrar_usuario, () => {
            boton_click.play();


            // Confirmación (opcional)
            const usernameToDelete = connectedUser.username; // Obtener el nombre de usuario conectado
            if (!usernameToDelete) {
                console.error("No hay un usuario conectado para borrar.");
                return;
            }

            // Enviar la petición DELETE
            $.ajax({
                method: "DELETE",
                url: `/users`,
                contentType: 'application/json',
                data: usernameToDelete
            })
                .done((data) => {
                    console.log(data);

                    // Realizar logout
                    connectedUser.logOut();

                    // Redirigir a la pantalla de login
                    this.cameras.main.fadeOut(500, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.stop("SettingsScreen");
                        this.scene.start("LoginScreen");
                    });
                })
                .fail(() => {
                    console.error(`Error al borrar el usuario`);
                });
        })

    };
}


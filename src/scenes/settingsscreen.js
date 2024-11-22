export class SettingsScreen extends Phaser.Scene{
    constructor(){
        super({key: 'SettingsScreen'});
    }

    preload() {

    }

    create() {
        
        const sliderX = 400; // Posición x del slider
        const sliderY = 200; // Posición Y del slider
        const sliderWidth = 400; // Ancho del slider
        const sliderHeight = 30; // Alto del slider

        // Barra del slider
        const sliderBar = this.add.rectangle(sliderX, sliderY, sliderWidth, sliderHeight, 0xaaaaaa);

        // Handler del slider
        const handle = this.add.rectangle(sliderX, sliderY, 40, 40, 0xff0000).setInteractive();

        // Texto con el porcentaje del volumen
        const volumeText = this.add.text(320, sliderY - 50, 'Volume: 50%', { fontSize: '24px', color: '#ffffff' });


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
        volumeText.setText(`Volume: ${(volume * 100).toFixed(0)}%`);

        this.input.setDraggable(handle); //Hacer que se pueda deslizar el handler por la barra

        
        this.input.on('drag', (pointer, gameObject, dragX) => { //Al deslizar el handle, se cambia el volumen y se almacena en el datamanager
            if (gameObject === handle) {
                handle.x = Phaser.Math.Clamp(dragX, minX, maxX);
                const newVolume = (handle.x - minX) / sliderWidth;
                this.sound.volume = newVolume;
                this.registry.set('volume', newVolume);
                volumeText.setText(`Volume: ${(newVolume * 100).toFixed(0)}%`);
            }
        });

        const boton_inicio = this.add.image(200, 550, "boton_inicio")
             .setInteractive()
             .on('pointerdown', () => {
                 this.scene.stop("SettingsScreen");
                 this.scene.start("StartScreen");
         });
        
    }

    update() {}

}
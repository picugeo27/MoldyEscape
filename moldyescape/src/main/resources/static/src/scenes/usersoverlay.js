
export class UsersOverlay extends Phaser.Scene {
    constructor() {
        super({ key: 'UsersOverlay'});
    }

    preload() {
    }

    create() {
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

        // Añadir usuarios
        this.statsText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Usuarios activos',
            { fontSize: '20px', color: '#ffffff', align: 'center' }
        );
        this.statsText.setOrigin(0.5, 0.5);
        this.statsText.setVisible(false);

        // Mostrar y ocultar
        this.input.keyboard.on('keydown-TAB', () => {
            this.toggleOverlay(true);
        });

        this.input.keyboard.on('keyup-TAB', () => {
            this.toggleOverlay(false);
        });
    }

    toggleOverlay(show) {
        this.overlay.setVisible(show);
        this.statsText.setVisible(show);
    }
}

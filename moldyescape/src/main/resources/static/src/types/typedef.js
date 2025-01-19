const TILE_SIZE = 24;
export const MAP_INIT = 180;

export const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

export const SIZE_CANVAS = {
  WIDTH: 800,
  HEIGHT: 600
}

export class Coordinates {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x = 0, y = 0) {
    this.x = x,
      this.y = y
  }

  getRealX() {
    return MAP_INIT + this.x * TILE_SIZE + TILE_SIZE / 2;
  }

  getRealY() {
    return this.y * TILE_SIZE + TILE_SIZE / 2;
  }
}

export function setupButton(button, onClick) {

  button.setInteractive();

  button.on('pointerover', () => {
    button.postFX.addShine(0.8, 0.05, 1);
  });

  button.on('pointerout', () => {
    button.setScale(1);
    button.postFX.clear();
  });

  button.on('pointerup', () => {
    button.setScale(button.scale += 0.05);
  });

  button.on('pointerdown', () => {
    button.setScale(button.scale -= 0.05);
    onClick()
  });
}

export function popUpText(scene, text, duration = 2000) {
  const message = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, text, {
    fontSize: '32px',
    color: '#ffffff',
    fontStyle: 'bold',
    align: 'center',
    padding: { x: 10, y: 10 },
  });

  message.setOrigin(0.5);

  // Calcular el tamaño del rectángulo de fondo según el texto
  const background = scene.add.rectangle(
    scene.cameras.main.centerX,
    scene.cameras.main.centerY,
    message.width + 20,
    message.height + 20,
    0x000000, // color
    0.8 // transparencia
  );

  // Configurar el origen del fondo en el centro
  background.setOrigin(0.5);

  const group = scene.add.container(0, 0, [background, message]);

  scene.tweens.add({
    targets: group,
    alpha: 0, // Desvanecer el grupo
    ease: 'Linear',
    y: scene.cameras.main.centerY - 500, // se mueve hacia arriba
    duration: 1000,
    delay: duration,
    onComplete: () => {
      group.destroy();
    },
  });
}


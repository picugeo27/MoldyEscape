const TILE_SIZE = 24;

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

export class Coordinates{
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x = 0, y = 0){
    this.x = x,
    this.y = y
  }

  getRealX(){
    return this.x * TILE_SIZE + TILE_SIZE/2;
  }

  getRealY (){
    return this.y * TILE_SIZE + TILE_SIZE/2;
  }
}

export function setupButton(button, onClick){

  button.setInteractive();

  button.on('pointerover', () => {
      button.postFX.addShine(0.8,0.05,1);
  });

  button.on('pointerout', () => {
      button.setScale(0.95);
      button.postFX.clear();
  });

  button.on('pointerup', () => {
    button.setScale(button.scale+=0.05);
});

  button.on('pointerdown', () => {
    button.setScale(button.scale-=0.05);
    onClick()
  });
}

const TILE_SIZE = 24;

export const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

export class Coordinates{
  constructor(x = 0, y = 0){
    this.x = x,
    this.y = y
  }

  getRealX(){
    return this.x * TILE_SIZE;
  }

  getRealY (){
    return this.y * TILE_SIZE;
  }
}
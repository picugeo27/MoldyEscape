
// clase Move, para seguir usando patron command uwu x2
export class Move{
    #gameObject;        // objeto que movemos
    #inputComponent;    // controles con los que lo movemos
    #speed;
    constructor(gameObject, inputManager, speed = 100){
        this.#gameObject = gameObject;
        this.#inputComponent = inputManager;
        this.#speed = speed;
    }

    update(){
        this.#gameObject.body.velocity.x = 0;
        this.#gameObject.body.velocity.y = 0;
        
        if(this.#inputComponent.upDown){
            this.#gameObject.body.velocity.y = -this.#speed;
            console.log("Se mueve hacia arriba creo")
        } else if (this.#inputComponent.downDown){
            this.#gameObject.body.velocity.y = this.#speed; 
        } else if (this.#inputComponent.leftDown){
            this.#gameObject.body.velocity.x = -this.#speed;
        } else if (this.#inputComponent.rightDown){
            this.#gameObject.body.velocity.x = this.#speed;
        }
    }
}
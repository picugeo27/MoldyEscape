import Phaser from "./lib/phaser.js";

import { GameScreen } from "./scenes/gamescreen.js";
import { StartScreen } from "./scenes/startscreen.js";
import { EndScreen } from "./scenes/endscreen.js";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-canvas',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: true,
        }
    },
});

game.scene.add('GameScreen', GameScreen);
game.scene.add('StartScreen', StartScreen);
game.scene.add('EndScreen', EndScreen);
game.scene.start('StartScreen');
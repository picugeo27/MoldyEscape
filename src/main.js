import Phaser from "./lib/phaser.js";

import { GameScreen } from "./scenes/gamescreen.js";
import { StartScreen } from "./scenes/startscreen.js";
import { EndScreen } from "./scenes/endscreen.js";
import { CreditsScreen } from "./scenes/creditsscreen.js";
import { SIZE_CANVAS } from "./types/typedef.js";
import { SettingsScreen } from "./scenes/settingsscreen.js";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: SIZE_CANVAS.WIDTH,
    height: SIZE_CANVAS.HEIGHT,
    parent: 'game-canvas',
    backgroundColor: '#97c6e0',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: true,
        }
    },
    scale:{
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    }
});

//game.scene.add('GameScreen', GameScreen);
game.scene.add('StartScreen', StartScreen, false, game);
game.scene.add('EndScreen', EndScreen);//, false, game);
game.scene.add('CreditsScreen', CreditsScreen);
game.scene.add('SettingsScreen', SettingsScreen);
game.scene.start('StartScreen');


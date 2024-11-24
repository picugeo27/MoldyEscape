import Phaser from "./lib/phaser.js";

import { StartScreen } from "./scenes/startscreen.js";
import { EndScreen } from "./scenes/endscreen.js";
import { CreditsScreen } from "./scenes/creditsscreen.js";
import { SIZE_CANVAS } from "./types/typedef.js";
import { SelectScreen } from "./scenes/selectscreen.js";
import { SettingsScreen } from "./scenes/settingsscreen.js";
import { TutoriaScreen } from "./scenes/tutorialscreen.js";


const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 900,
    height: SIZE_CANVAS.HEIGHT,
    parent: 'game-canvas',
    backgroundColor: '#97c6e0',
    scale:{
        mode: Phaser.Scale.EXPAND,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: true,
        }
    },
});

game.scene.add('StartScreen', StartScreen);
game.scene.add('SelectScreen', SelectScreen);
game.scene.add('TutorialScreen', TutoriaScreen);
game.scene.add('EndScreen', EndScreen);
game.scene.add('CreditsScreen', CreditsScreen);
game.scene.add('SettingsScreen', SettingsScreen);
game.scene.start('StartScreen');


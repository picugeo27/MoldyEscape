import Phaser from "./lib/phaser.js";

import { StartScreen } from "./scenes/startscreen.js";
import { EndScreen } from "./scenes/endscreen.js";
import { CreditsScreen } from "./scenes/creditsscreen.js";
import { SIZE_CANVAS } from "./types/typedef.js";
import { SelectScreen } from "./scenes/selectscreen.js";
import { SettingsScreen } from "./scenes/settingsscreen.js";
import { TutorialScreen } from "./scenes/tutorialscreen.js";
import { UsersOverlay } from "./scenes/usersoverlay.js";
import { LoginScreen } from "./scenes/loginscreen.js";


const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: SIZE_CANVAS.WIDTH,
    height: SIZE_CANVAS.HEIGHT,
    parent: 'game-canvas',
    backgroundColor: '#97c6e0',
    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false,
        }
    } 
});

game.scene.add('StartScreen', StartScreen);
game.scene.add('SelectScreen', SelectScreen);
game.scene.add('TutorialScreen', TutorialScreen);
game.scene.add('EndScreen', EndScreen);
game.scene.add('CreditsScreen', CreditsScreen);
game.scene.add('SettingsScreen', SettingsScreen);
game.scene.add('UsersOverlay', UsersOverlay); 
game.scene.add('LoginScreen', LoginScreen);
//game.scene.start('StartScreen');
game.scene.start('LoginScreen');

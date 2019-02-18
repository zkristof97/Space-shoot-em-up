import * as PIXI from 'pixi.js';
import Application from './application';
import Menu from './menu';
import Panel from './panel';
import GameOver from './gameOver';
import GamePlay from './gamePlay';
import Sounds from './sound';
import Movement from './movement';
import Control from './control';

let appOptions: PIXI.ApplicationOptions = {
    width: 800,
    height: 600,
    antialias: true,
    transparent: false,
    resolution: 1
};

let app: PIXI.Application;

startGame();

function startGame(): void {
    app = new PIXI.Application(appOptions);

    document.getElementById('display').appendChild(app.view);

    PIXI.loader.add('splash-screen', 'resources/images/splash-screen4.png')
        .add('background', 'resources/images/parallaxImgs.json')
        .add('resources/images/moon.json')
        .add('explosion', 'resources/images/explosion.json')
        .add('logo', 'resources/images/logo-text.png')
        .add('button', 'resources/images/button.png')
        .add('starBg', 'resources/images/stars.png')
        .add('images', 'resources/images/sprites.json')
        .add('game-over', 'resources/images/game-over.png')
        .add('resources/images/circle.png')
        .add('pauseBtn', 'resources/images/pauseBtn.png')
        .add('panel', 'resources/images/panel.png')
        .add('stopBtn', 'resources/images/stopBtn.png')
        .add('playBtn', 'resources/images/playBtn.png')
        .add('replayBtn', 'resources/images/replayBtn.png')
        .add('missles', 'resources/images/missles.json')
        .add('menuSound', 'resources/sounds/menu_background.mp3')
        .add('backgroundSound', 'resources/sounds/background-music.mp3')
        .add('gameOverSound', 'resources/sounds/game_over.mp3')
        .add('engineSound', 'resources/sounds/engine_sound.mp3')
        .add('explosionSound', 'resources/sounds/explosion.mp3')
        .add('missleSound', 'resources/sounds/missle_shoot.mp3')
        .add('soundOn', 'resources/images/sound_on.png')
        .add('soundOff', 'resources/images/sound_off.png')
        .add('cosmos', 'resources/images/cosmos-bg.png')
        .add('logo-new', 'resources/images/logo.png')
        .load(splashReady);

    //show splash screen
    function splashReady(): void {
        let splashScreen: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['splash-screen'].texture);

        app.stage.addChild(splashScreen);

        setTimeout(() => {
            app.ticker.add(function fadeOut() {
                if (splashScreen.alpha > 0) {

                    splashScreen.alpha -= 0.03;

                } else {
                    app.ticker.remove(fadeOut);

                    Application.state = 'menu';

                    app.ticker.add(gameLoop);
                }
            });
        }, 2000);
    }
}

function gameLoop(): void {
    Sounds.stopSounds();
    Sounds.playSounds();

    Movement.start(app);

    if (Application.state === 'menu') {
        Menu.init(app);

        Application.state = '';
    } if (Application.state === 'replay') {
        GamePlay.noEnemySpawn();

        Application.movementOn = false;

        Application.state = 'play';
    } else if (Application.state === 'play') {
        Control.enable(app);

        GamePlay.initPlay(app);

        Application.movementOn = true;

        Application.state = '';
    } else if (Application.state === 'pause') {
        GamePlay.noEnemySpawn();

        Application.movementOn = false;

        Panel.showPanel(true, app);

        Application.shouldPause = false;

        Application.state = '';
    } else if (Application.state === 'unpause') {
        GamePlay.spawnEnemy(app);

        Application.movementOn = true;

        Panel.showPanel(false, app);

        Application.state = '';
    } else if (Application.state === 'stop') {
        GamePlay.noEnemySpawn();

        Application.movementOn = false;

        Panel.showPanel(false, app);

        Application.shouldPause = true;

        if (Application.isReplay === true) {
            Application.isReplay = false;

            Application.state = 'play';
        } else if (Application.isGameOver === true) {
            Application.isGameOver = false;

            Application.state = '';
        } else {
            Application.state = 'menu';
        }
    } else if (Application.state === 'gameOver') {
        Control.disable();

        GameOver.display(app);

        Panel.deactivatePauseBtn();

        Application.isGameOver = true;

        Application.state = 'stop';
    } else if (Application.state === 'exit') {
        window.location.replace('https://www.google.com/');

        Application.state = '';
    }
}
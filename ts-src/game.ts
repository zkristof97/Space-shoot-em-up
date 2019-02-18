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

    PIXI.loader
        //load all the images
        .add('images', 'resources/images/images.json')
        //load sound effects
        .add('menuSound', 'resources/sounds/menu_background.mp3')
        .add('backgroundSound', 'resources/sounds/background-music.mp3')
        .add('gameOverSound', 'resources/sounds/game_over.mp3')
        .add('engineSound', 'resources/sounds/engine_sound.mp3')
        .add('explosionSound', 'resources/sounds/explosion.mp3')
        .add('missleSound', 'resources/sounds/missle_shoot.mp3')
        .load(loaded);

    //show splash screen
    function loaded(): void {
        let splashScreen: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['splash-screen.png']);

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

//our game loop that handles the state changes and behaves accordingly
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

        Movement.enemySpeed = 4;

        Application.state = '';
    } else if (Application.state === 'pause') {
        GamePlay.noEnemySpawn();

        Application.movementOn = false;

        Panel.showPanel(app);

        Application.shouldPause = false;

        Application.state = '';
    } else if (Application.state === 'unpause') {
        GamePlay.spawnEnemy(app);

        Application.movementOn = true;

        Panel.hidePanel(app);

        Application.state = '';
    } else if (Application.state === 'stop') {
        GamePlay.noEnemySpawn();

        Application.movementOn = false;

        Panel.hidePanel(app);

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
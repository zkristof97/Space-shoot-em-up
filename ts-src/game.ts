import Application from './application';
import Animation from './animation';
import Menu from './menu';
import Panel from './panel';
import GameOver from './gameOver';
import GamePlay from './gamePlay';
import HitTest from './hitTest';
import Sounds from './sound';

let appOptions: PIXI.ApplicationOptions = {
    width: 800,
    height: 600,
    antialias: true,
    transparent: false,
    resolution: 1
};

let app: PIXI.Application;
let menu: Menu;
let panel: Panel;

startGame();

function startGame(): void {
    app = new PIXI.Application(appOptions);
    menu = new Menu();
    panel = new Panel();

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
        let splashScreen = new PIXI.Sprite(PIXI.loader.resources['splash-screen'].texture);
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
    movements();
    if (Application.state === 'menu') {
        menu.init(app);

        Application.state = '';
    } if (Application.state === 'replay') {
        GamePlay.noEnemySpawn();

        Application.movementOn = false;

        Application.state = 'play';
    } else if (Application.state === 'play') {
        addControl();

        GamePlay.initPlay(app);

        Application.movementOn = true;

        Application.state = '';
    } else if (Application.state === 'pause') {
        GamePlay.noEnemySpawn();

        Application.movementOn = false;

        panel.showPanel(true, app);

        Application.shouldPause = false;

        Application.state = '';
    } else if (Application.state === 'unpause') {
        GamePlay.spawnEnemy(app);

        Application.movementOn = true;

        panel.showPanel(false, app);

        Application.state = '';
    } else if (Application.state === 'stop') {
        GamePlay.noEnemySpawn();

        Application.movementOn = false;

        panel.showPanel(false, app);

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
        GameOver.display(app);

        removeControl();

        panel.deactivatePauseBtn();

        Application.isGameOver = true;

        Application.state = 'stop';
    } else if (Application.state === 'exit') {
        window.location.replace('https://www.google.com/');

        Application.state = '';
    }
}

function addControl(): void {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
}

function removeControl(): void {
    window.removeEventListener('keydown', keyDownHandler);
    window.removeEventListener('keyup', keyUpHandler);
}

function movements(): void {
    if (Application.movementOn === true) {
        backgroundMovement();
        playerMovement();
        enemyMovement();
        missleMovement();
    }
}

function backgroundMovement(): void {
    //parallax scrolling
    for (let i = 0; i < GamePlay.parallaxImgs.length; i++) {
        GamePlay.parallaxImgs[i].tilePosition.x -= GamePlay.parallaxImgs[i].velocity;
    }
}

function playerMovement(): void {
    Application.player.x += Application.player.velocityX;
    Application.player.y += Application.player.velocityY;

    //we check if the player is inside the bounds, e.g. did not leave the screen
    GamePlay.checkPosition(5, 4, app);
}

function enemyMovement(): void {
    for (let i = Application.enemies.length - 1; i >= 0; i--) {
        let currentEnemy: PIXI.Sprite = Application.enemies[i];

        currentEnemy.x -= 4;

        //we check if the enemy has left the screen, if so remove it
        if (currentEnemy.x <= 0 - currentEnemy.width / 2) {
            Application.enemies = Application.enemies.filter(e => e !== currentEnemy);
            app.stage.removeChild(currentEnemy);
        }
        
        HitTest.detectCollision(Application.player, currentEnemy, app);
    }
}

function missleMovement(): void {
    for (let i = Application.missles.length - 1; i >= 0; i--) {
        let currentMissle: PIXI.Sprite = Application.missles[i];

        currentMissle.x += 7;

        //If missle has left the screen, remove it
        if (currentMissle.x > app.view.width) {
            Application.missles = Application.missles.filter(m => m !== currentMissle);
            app.stage.removeChild(currentMissle);
        }

        //check to see if missle hit any of the enemies 
        for (let j = 0; j < Application.enemies.length; j++) {
            let currentEnemy: PIXI.Sprite = Application.enemies[j];

            if (currentMissle !== null && currentMissle !== undefined && currentEnemy !== null && currentEnemy !== undefined) {
                GamePlay.checkTargetHit(currentMissle, currentEnemy, app);
            }
        }
    }
}

function keyUpHandler(e: KeyboardEvent): void {
    switch (e.key) {
        case ' ':
            Application.canShoot = true;
            break;
        case 'ArrowLeft':
            Application.player.velocityX = 0;
            break;
        case 'ArrowUp':
            Application.player.velocityY = 0;
            break;
        case 'ArrowRight':
            Application.player.velocityX = 0;
            break;
        case 'ArrowDown':
            Application.player.velocityY = 0;
            break;
    }
}

function keyDownHandler(e: KeyboardEvent): void {
    let speed = 5;
    switch (e.key) {
        case ' ':
        //we use a flag to prevent user from shooting a lot of missles while holding down the spacebar
            if (Application.canShoot === true) {
                Animation.missle(app);
                Application.canShoot = false;
            }
            break;
        case 'ArrowLeft':
            Application.player.velocityX = -speed;
            break;
        case 'ArrowUp':
            Application.player.velocityY = -speed;
            break;
        case 'ArrowRight':
            Application.player.velocityX = speed;
            break;
        case 'ArrowDown':
            Application.player.velocityY = speed;
            break;
    }
}
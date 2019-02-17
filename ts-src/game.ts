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

function startGame() {
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

    function splashReady() {
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

function gameLoop() {
    /* Application.addSoundMuteBtn(app); */
    if(Application.soundOn === true){
        Sounds.stopSounds();
        Sounds.playSounds();
    }
    movements();
    if (Application.state === 'menu') {
        menu.init(app);
        Application.state = '';
    } if (Application.state === 'replay') {
        Application.score = 0;
        GamePlay.noEnemySpawn();
        Application.movementOn = false;
        Application.state = 'play';
    } else if (Application.state === 'play') {
        Application.movementOn = true;
        Animation.stopAlienSpawn();
        app.stage.removeChildren();
        GamePlay.initBackground(app);
        addControl();
        GamePlay.addScoreLabel(app);
        Application.movementOn = true;
        panel.addPauseBtn(app);
        GamePlay.spawnEnemy(app);
        GamePlay.createPlayer(app);
        Application.state = '';
    } else if (Application.state === 'pause') {
        Application.shouldPause = false;
        panel.showPanel(true, app);
        GamePlay.noEnemySpawn();
        Application.movementOn = false;
        Application.state = '';
    } else if (Application.state === 'unpause') {
        Application.movementOn = true;
        panel.showPanel(false, app);
        GamePlay.spawnEnemy(app);
        Application.state = '';
    } else if (Application.state === 'stop') {
        Application.score = 0;
        Application.shouldPause = true;
        panel.showPanel(false, app);
        Application.movementOn = false;
        GamePlay.noEnemySpawn();
        Application.missles = new Array();
        Application.enemies = new Array();
        Application.doExplosion = true;
        if (Application.isReplay === true) {
            Application.isReplay = false;
            Application.state = 'play';
        } else if (Application.isGameOver === false) {
            Application.state = 'menu';
        } else {
            Application.isGameOver = false;
            Application.state = '';
        }
    } else if (Application.state === 'gameOver') {
        removeControl();
        Application.movementOn = false;
        Application.isGameOver = true;
        panel.deactivatePauseBtn();
        GameOver.display(app);
        Application.state = 'stop';
    } else if (Application.state === 'exit') {
        window.location.replace('https://www.google.com/');
        Application.state = '';
    }
}

function addControl() {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
}

function removeControl(){
    window.removeEventListener('keydown', keyDownHandler);
    window.removeEventListener('keyup', keyUpHandler);
}

function movements() {
    if(Application.movementOn === true){
        backgroundMovement();
        playerMovement();
        enemyMovement();
        missleMovement();
    }
}

function backgroundMovement(){
    for(let i = 0; i < GamePlay.parallaxImgs.length; i++){
        GamePlay.parallaxImgs[i].tilePosition.x -= GamePlay.parallaxImgs[i].velocity;
    }
}

function playerMovement() {
    Application.player.x += Application.player.velocityX;
    Application.player.y += Application.player.velocityY;
    
    GamePlay.checkPosition(Application.speed, Application.offset, app);
}

function enemyMovement() {
    for (let i = Application.enemies.length - 1; i >= 0; i--) {
        let currentEnemy = Application.enemies[i];
        currentEnemy.x -= 4;

        HitTest.detectCollision(Application.player, currentEnemy, app);

        if (currentEnemy.x <= 0 - currentEnemy.width / 2) {
            Application.enemies = Application.enemies.filter(e => e !== currentEnemy);
            app.stage.removeChild(currentEnemy);
        }
    }
}

function missleMovement() {
    for (let i = Application.missles.length - 1; i >= 0; i--) {
        let currentMissle: PIXI.Sprite = Application.missles[i];
        currentMissle.x += 7;

        if (currentMissle.x > app.view.width) {
            Application.missles = Application.missles.filter(m => m !== currentMissle);
        }
    }

    for (let j = 0; j < Application.missles.length; j++) {
        for (let k = 0; k < Application.enemies.length; k++) {
            if (Application.missles[j] !== null && Application.missles[j] !== undefined && Application.enemies[k] !== null && Application.enemies[k] !== undefined) {
                GamePlay.checkTargetHit(Application.missles[j], Application.enemies[k], app);
            }
        }
    }
}

/* function explode(object, enemy) {
    let frames: PIXI.Texture[] = new Array();

    Application.doExplosion = false;

    for (let i = 1; i <= 11; i++) {
        let index = i < 10 ? '0' + i : i;
        frames.push(PIXI.Texture.fromFrame('boom' + index + '.png'));
    }

    app.stage.removeChild(object);
    app.stage.removeChild(enemy);
    let anim = new PIXI.extras.AnimatedSprite(frames)
    anim.loop = false;
    anim.anchor.set(0.5);
    anim.animationSpeed = 11 / 60;
    anim.position.set(object.x + 100, object.y);
    anim.play();
    app.stage.addChild(anim);

    anim.onComplete = () => {
        app.stage.removeChild(anim);
        app.ticker.remove(movements);
        Application.state = 'gameOver';
    };
} */

function keyUpHandler(e: any): void {
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

function keyDownHandler(e: any) {
    let speed = 5;
    Sounds.playEngineSound();    
    switch (e.key) {
        case ' ':
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
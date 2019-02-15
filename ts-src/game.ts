import Application from './application';
import Animation from './animation';
import Menu from './menu';
import Star from './star';
import Panel from './panel';
import GameOver from './gameOver';
import GamePlay from './gamePlay';
import HitTest from './hitTest';

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

    PIXI.loader.add('splash-screen', 'resources/images/splash-screen.png')
        .add('explosion', 'resources/images/explosion.json')
        .add('moon', 'resources/images/moon-animation.json')
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
                    app.ticker.add(gameLoop);
                    Application.state = 'menu';
                }
            });
        }, 2000);
    }
}

function gameLoop() {
    if (Application.state === 'menu') {
        menu.init(app);
        Application.state = '';

    } if (Application.state === 'replay') {
        Application.score = 0;
        GamePlay.noEnemySpawn();
        app.ticker.remove(movements);
        Application.state = 'play';
    } else if (Application.state === 'play') {
        app.stage.removeChildren();
        GamePlay.createPlayer(app);
        GamePlay.drawStars(app);
        addControl();
        GamePlay.addScoreLabel(app);
        app.ticker.add(movements);
        panel.addPauseBtn(app);
        GamePlay.spawnEnemy(app);
        Application.state = '';
    } else if (Application.state === 'pause') {
        Application.shouldPause = false;
        panel.showPanel(true, app);
        GamePlay.noEnemySpawn();
        app.ticker.remove(movements);
        Application.state = '';
    } else if (Application.state === 'unpause') {
        app.ticker.add(movements);
        panel.showPanel(false, app);
        GamePlay.spawnEnemy(app);
        Application.state = '';
    } else if (Application.state === 'stop') {
        Application.score = 0;
        Application.shouldPause = true;
        panel.showPanel(false, app);
        app.ticker.remove(movements);
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
        app.ticker.remove(movements);
        window.removeEventListener('keydown', keyDownHandler);
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

function movements() {
    playerMovement();
    enemyMovement();
    parallaxMovement();
    missleMovement();
}

function playerMovement() {
    Application.player.x += Application.player.velocityX;
    Application.player.y += Application.player.velocityY;
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
        currentMissle.x += 10;

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

function parallaxMovement() {
    for (let i = 0; i < Application.stars.length; i++) {
        let currentStar: Star = Application.stars[i];
        currentStar.x -= 1;

        if (currentStar.x < 0) {
            currentStar.x *= -currentStar.speed;
            currentStar.x += app.view.width;
            currentStar.y = Application.randomNumber(1, 600);
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
    switch (e.keyCode) {
        case 32:
            Application.canShoot = true;
            break;
        case 37:
            Application.player.velocityX = 0;
            break;
        case 38:
            Application.player.velocityY = 0;
            break;
        case 39:
            Application.player.velocityX = 0;
            break;
        case 40:
            Application.player.velocityY = 0;
            break;
    }
}

function keyDownHandler(e: any) {
    let speed = 5;
    let offset = 4;
    switch (e.keyCode) {
        case 32:
            if (Application.canShoot === true) {
                Animation.missle(app);
                Application.canShoot = false;
            }
            GamePlay.checkPosition(speed, offset, app);
            break;
        case 37:
            Application.player.velocityX = -speed;
            GamePlay.checkPosition(speed, offset, app);
            break;
        case 38:
            Application.player.velocityY = -speed;
            GamePlay.checkPosition(speed, offset, app);
            break;
        case 39:
            Application.player.velocityX = speed;
            GamePlay.checkPosition(speed, offset, app);
            break;
        case 40:
            Application.player.velocityY = speed;
            GamePlay.checkPosition(speed, offset, app);
            break;
    }
}
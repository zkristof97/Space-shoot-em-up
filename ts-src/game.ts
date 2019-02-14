import Application from './application';
import Character from './Character';
import { Sprite } from 'pixi.js';
import { Menu } from './menu';
import Star from './star';
import Panel from './panel';
import GameOver from './gameOver';

let player: Character;

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
        .load(splashReady);

    function splashReady() {
        let splashScreen = new Sprite(PIXI.loader.resources['splash-screen'].texture);
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
        
    } if(Application.state === 'replay'){
        Application.score = 0;
        noEnemySpawn();
        app.ticker.remove(movements);
        Application.state = 'play';
    } else if (Application.state === 'play') {
        console.log('play: ', Application.shouldPause);
        
        app.stage.removeChildren();
        createPlayer();
        drawStars();
        addControl();
        addScoreLabel();
        app.ticker.add(movements);
        panel.addPauseBtn(app);
        spawnEnemy();
        Application.state = '';
    } else if (Application.state === 'pause') {
        Application.shouldPause = false;
        panel.showPanel(true, app);
        noEnemySpawn();
        app.ticker.remove(movements);
        Application.state = '';
        console.log('pause: ', Application.shouldPause);
    } else if (Application.state === 'unpause') {
        app.ticker.add(movements);
        panel.showPanel(false, app);
        spawnEnemy();
        Application.state = '';
        console.log('unpause: ', Application.shouldPause);
    } else if (Application.state === 'stop'){
        Application.score = 0;
        Application.shouldPause = true;
        panel.showPanel(false, app);
        app.ticker.remove(movements);
        noEnemySpawn();
        Application.missles = new Array();
        Application.enemies = new Array();
        Application.doExplosion = true;
        if(Application.isReplay === true){
            Application.isReplay = false;
            Application.state = 'play';
        } else if(Application.isGameOver === false){
            Application.state = 'menu';
        }else{
            Application.isGameOver = false;
            Application.state = '';
        }
        console.log('stop: ', Application.shouldPause);
    } else if (Application.state === 'gameOver'){
        Application.isGameOver = true;
        panel.deactivatePauseBtn();
        GameOver.display(app);
        Application.state = 'stop';
    }
}

function spawnEnemy() {
    Application.intervalId = setInterval(() => {
        addEnemy();
    }, 2000);
}

function noEnemySpawn() {
    clearInterval(Application.intervalId);
}

function drawStars() {
    for (var i = 0; i < 430; i++) {
        let star;
        if (i % 2 === 0) {
            star = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 3);
        }
        else {
            star = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 20);
        }
        star.position.set(Application.randomNumber(1, 800), Application.randomNumber(1, 600));
        star.scale.set(0.01);
        app.stage.addChild(star);
        Application.stars.push(star);
    }
}

function addControl() {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
}

function createPlayer() {
    player = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
    player.position.set(75, app.view.height / 2);
    player.velocityX = 0;
    player.velocityY = 0;
    app.stage.addChild(player);
}

function addScoreLabel() {
    Application.message = new PIXI.Text('Score: 0', {fill: 0xFFFFFF});
    Application.message.position.set(10, 10);
    app.stage.addChild(Application.message);
}

function movements() {
    playerMovement();
    enemyMovement();
    parallaxMovement();
    missleMovement();
}

function playerMovement(){
    player.x += player.velocityX;
    player.y += player.velocityY;
}

function enemyMovement(){
    for (let i = Application.enemies.length - 1; i >= 0; i--) {
        let currentEnemy = Application.enemies[i];
        currentEnemy.x -= 4;
        
        detectCollision(player, currentEnemy);

        if (currentEnemy.x <= 0 - currentEnemy.width / 2) {
            Application.enemies = Application.enemies.filter(e => e !== currentEnemy);
            app.stage.removeChild(currentEnemy);
        }
    }
}

function missleMovement(){
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
                checkTargetHit(Application.missles[j], Application.enemies[k]);
            }
        }
    }
}

function parallaxMovement(){
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

function addEnemy() {
    let enemy = new PIXI.Sprite(PIXI.loader.resources['images'].textures['alien.png']);
    enemy.scale.set(0.15, 0.15);
    enemy.position.set(app.view.width, Application.randomNumber(enemy.height, 600 - enemy.height));
    Application.enemies.push(enemy);
    app.stage.addChild(enemy);
}

function detectCollision(player: Character, enemy: PIXI.Sprite): void {
    if (isCollision(player.getBounds(), enemy.getBounds())) {
        if (Application.doExplosion === true) {
            explode(player, enemy, false);
        }
    }
}

function explode(object, enemy, isMissle: boolean) {
    let frames: PIXI.Texture[] = new Array();

    if (isMissle === false) {
        Application.doExplosion = false;
        window.removeEventListener('keydown', keyDownHandler);
    }

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

    if (isMissle === true) {
        anim.onComplete = () => {
            app.stage.removeChild(anim);
            drawParticles(enemy);
        }
    }
    else {
        anim.onComplete = () => {
            app.stage.removeChild(anim);
            app.ticker.remove(movements);
            Application.state = 'gameOver';
        };
    }
}

function drawParticles(object: Character) {
    let particles: Sprite[] = new Array();
    let container = new PIXI.Container();

    for (let i = 0; i < object.height; i += 5) {
        for (let j = 0; j < object.width; j += 5) {
            let particle = new Sprite(PIXI.loader.resources['resources/images/circle.png'].texture);
            particle.position.set(j, i);
            particle.tint = 0xff0000;
            particle.scale.set(0.01);
            particles.push(particle);
            container.addChild(particle);
        }
    }

    app.stage.addChild(container);
    container.position.set(object.x, object.y);

    setTimeout(() => {
        for (let i = 1; i >= 0; i -= 0.1) {
            for (let j = 0; j < particles.length; j++) {
                particles[j].alpha = i;
            }
        }
        for (let i = 0; i < particles.length; i++) {

            particles = particles.filter(e => e !== particles[i]);
        }
        app.stage.removeChild(container);
    }, 1200);
}

function isCollision(player, enemy) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    hit = false;

    player.centerX = player.x + player.width / 2;
    player.centerY = player.y + player.height / 4;
    enemy.centerX = enemy.x + enemy.width / 2;
    enemy.centerY = enemy.y + enemy.height / 2;

    player.halfWidth = player.width / 2;
    player.halfHeight = player.height / 4;
    enemy.halfWidth = enemy.width / 2;
    enemy.halfHeight = enemy.height / 2;

    vx = player.centerX - enemy.centerX;
    vy = player.centerY - enemy.centerY;

    combinedHalfWidths = player.halfWidth + enemy.halfWidth;
    combinedHalfHeights = player.halfHeight + enemy.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true;
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
};

function checkTargetHit(missle: PIXI.Sprite, enemy: PIXI.Sprite) {
    if (isCollide(missle.getBounds(), enemy.getBounds()) === true) {
        Application.missles = Application.missles.filter(m => m !== missle);
        app.stage.removeChild(missle);

        explode(missle, enemy, true);

        Application.enemies = Application.enemies.filter(e => e !== enemy);
        app.stage.removeChild(enemy);

        Application.score++;
        Application.message.text = 'Score: ' + Application.score;
    }
}

function isCollide(missle, enemy) {
    return missle.x + missle.width / 2 >= enemy.x && missle.x <= enemy.x + enemy.width && missle.y + missle.height >= enemy.y && missle.y <= enemy.y + enemy.height;
}

function shoot() {
    let missle = new PIXI.Sprite(PIXI.loader.resources['images'].textures['missle.png']);
    missle.position.set(player.x + player.x / 2, player.y + player.height / 2);
    app.stage.addChild(missle);
    Application.missles.push(missle);
}

let canShoot: boolean = true;

function keyUpHandler(e: any): void {
    switch (e.keyCode) {
        case 32:
            canShoot = true;
            break;
        case 37:
            player.velocityX = 0;
            break;
        case 38:
            player.velocityY = 0;
            break;
        case 39:
            player.velocityX = 0;
            break;
        case 40:
            player.velocityY = 0;
            break;
    }
}

function keyDownHandler(e: any) {
    let speed = 5;
    let offset = 4;
    switch (e.keyCode) {
        case 32:
            if (canShoot) {
                shoot();
                canShoot = false;
            }
            checkPosition(speed, offset);
            break;
        case 37:
            player.velocityX = -speed;
            checkPosition(speed, offset);
            break;
        case 38:
            player.velocityY = -speed;
            checkPosition(speed, offset);
            break;
        case 39:
            player.velocityX = speed;
            checkPosition(speed, offset);
            break;
        case 40:
            player.velocityY = speed;
            checkPosition(speed, offset);
            break;
    }
}

function checkPosition(speed: number, offset: number) {
    if (player.x - speed * offset <= 0) {
        player.x = speed * offset;
    } else if (player.y - speed * offset <= 0) {
        player.y = speed * offset;
    } else if (player.x + player.width + speed * offset >= app.view.width) {
        player.x = app.view.width - speed * offset - player.width;
    } else if (player.y + player.height + speed * offset >= app.view.height) {
        player.y = app.view.height - speed * offset - player.height;
    }
}
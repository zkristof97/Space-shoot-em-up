import Application from './application';
import Character from './Character';
import { Sprite } from 'pixi.js';
import { Menu } from './menu';
import Star from './star';

let score: number = 0;
let missles: Character[] = new Array();
let enemies: Character[] = new Array();
let player: Character;
/* let app: Application = new Application('resources/images/player-enemy-atlas.json'); */

let appOptions: PIXI.ApplicationOptions = {
	width: 800,
	height: 600,
	antialias: true,
	transparent: false,
	resolution: 1
};

let app: PIXI.Application; 
let doExplosion: boolean = true;
let message = new PIXI.Text('Score: 0');
let menu: Menu;

startGame();

function startGame(){
    app = new PIXI.Application(appOptions);
    menu = new Menu();

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
                    menu.init(app);
                    app.ticker.add(gameLoop);
                }
            });
        }, 2000);
    }
}


function gameLoop(){
    if(Application.state === 'play'){
        app.stage.removeChildren();
        drawStars();
        run();
        Application.state = '';
    }
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

let intervalId;

function showPanel(shouldShow: boolean) {
    if (shouldShow === true) {
        Application.panel = new Sprite(PIXI.loader.resources['panel'].texture);
        Application.panel.anchor.set(0.5);
        Application.panel.position.set(app.view.width / 2, app.view.height / 2);
        app.stage.addChild(Application.panel);
        addPanelBtns();
    }
    else {
        shouldPause = true;
        app.stage.removeChild(Application.panel);

        for (let i = 0; i < Application.panelButtons.length; i++) {
            let currentButton = Application.panelButtons[i];
            Application.panelButtons = Application.panelButtons.filter(p => p !== currentButton);
            app.stage.removeChild(currentButton);
        }

        if (Application.panelButtons.length === 1) {
            app.stage.removeChild(Application.panelButtons[0]);
            Application.panelButtons.pop();
        }

    }
}



function addPanelBtns() {
    let stopBtn = new Sprite(PIXI.loader.resources['stopBtn'].texture);
    stopBtn.scale.set(0.8);
    stopBtn.setParent(Application.panel);
    stopBtn.position.set(stopBtn.parent.x - stopBtn.parent.width / 2 + 100, stopBtn.parent.y);
    stopBtn.anchor.set(0.5);
    stopBtn.interactive = true;
    stopBtn.addListener('click', backToMenu);
    app.stage.addChild(stopBtn);
    Application.panelButtons.push(stopBtn);

    let playBtn = new Sprite(PIXI.loader.resources['playBtn'].texture);
    playBtn.scale.set(0.4);
    playBtn.setParent(Application.panel);
    playBtn.position.set(playBtn.parent.x, playBtn.parent.y);
    playBtn.anchor.set(0.5);
    playBtn.interactive = true;
    playBtn.addListener('click', resumeGame);
    app.stage.addChild(playBtn);
    Application.panelButtons.push(playBtn);

    let replayBtn = new Sprite(PIXI.loader.resources['replayBtn'].texture);
    replayBtn.scale.set(0.32);
    replayBtn.setParent(Application.panel);
    replayBtn.position.set(replayBtn.parent.x + replayBtn.width * 1.5, replayBtn.parent.y);
    replayBtn.anchor.set(0.5);
    replayBtn.interactive = true;
    replayBtn.addListener('click', () => {
        console.log('click');

    });
    app.stage.addChild(replayBtn);
    Application.panelButtons.push(replayBtn);
}

let shouldPause: boolean = true;

function resumeGame() {
    app.ticker.add(movement);
    showPanel(false);
}

function run() {
    let pauseBtn = new Sprite(PIXI.loader.resources['pauseBtn'].texture);
    pauseBtn.anchor.set(1, 1);
    pauseBtn.scale.set(0.1);
    pauseBtn.tint = 0xFFFFFF;
    pauseBtn.position.set(app.view.width - 15, app.view.height - 15);
    pauseBtn.interactive = true;
    pauseBtn.addListener('click', () => {
        if (shouldPause === true) {
            shouldPause = false;
            app.ticker.remove(movement);
            showPanel(true);
        }
        else {
            resumeGame();
        }
    });

    app.stage.addChild(pauseBtn);

    message.style = new PIXI.TextStyle({
        fill: 0xFFFFFF
    });
    message.position.set(10, 10);
    app.stage.addChild(message);

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);


    intervalId = setInterval(addEnemy, 2000);

    player = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
    player.position.set(75, app.view.height / 2);
    player.velocityX = 0;
    player.velocityY = 0;
    app.stage.addChild(player);

    app.ticker.add(movement);
}

function movement() {
    player.x += player.velocityX;
    player.y += player.velocityY;

    for (let i = enemies.length - 1; i >= 0; i--) {
        let currentEnemy = enemies[i];
        currentEnemy.x -= 4;
        /* currentEnemy.y += app.randomNumber(-2, 2); */ //SHOULD I LEAVE IT IN OR NOT? DECIDE LATER

        detectCollision(player, currentEnemy);
        if (currentEnemy.x <= 0 - currentEnemy.width / 2) {
            enemies = enemies.filter(e => e !== currentEnemy);
            app.stage.removeChild(currentEnemy);
        }
    }

    for (let i = missles.length - 1; i >= 0; i--) {
        let currentMissle: Character = missles[i];
        currentMissle.x += 10;
        if (currentMissle.x > app.view.width) {
            missles = missles.filter(m => m !== currentMissle);
        }
    }

    for (let j = 0; j < missles.length; j++) {
        for (let k = 0; k < enemies.length; k++) {
            if (missles[j] !== null && missles[j] !== undefined && enemies[k] !== null && enemies[k] !== undefined) {
                checkTargetHit(missles[j], enemies[k]);
            }
        }
    }

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
    let enemy = new Character(PIXI.loader.resources['images'].textures['alien.png']);
    enemy.scale.set(0.15, 0.15);
    enemy.position.set(app.view.width, Application.randomNumber(enemy.height, 600 - enemy.height));
    enemies.push(enemy);
    app.stage.addChild(enemy);
}

function detectCollision(player: Character, enemy: any): void {
    if (isCollision(player.getBounds(), enemy.getBounds())) {
        if (doExplosion === true) {
            explode(player, enemy, false);
        }
    }
}

function displayGameOver() {
    let gameOver = new Sprite(PIXI.loader.resources['game-over'].texture);
    gameOver.anchor.set(0.5);
    gameOver.x = app.view.width / 2;
    gameOver.y = app.view.height / 2;
    app.stage.addChild(gameOver);
    addBackToMenuBtn(gameOver);
}

function backToMenu() {
    clearInterval(intervalId);
    missles = new Array();
    enemies = new Array();
    doExplosion = true;
    app.stage.removeChildren();
    score = 0;

    message.text = 'Score: ' + score;
    menu.init(app);
}

function addBackToMenuBtn(gameOverSign: Sprite) {
    let button = new Sprite(PIXI.loader.resources['button'].texture);
    button.anchor.set(0.5);
    button.scale.set(0.5);
    button.position.set(app.view.width / 2, app.view.height / 2 + gameOverSign.height / 2 + button.height);
    button.interactive = true;
    button.addListener('click', () => {
        backToMenu();
    });
    let text = new PIXI.Text('Back');
    text.anchor.set(0.5);
    text.position.set(button.x, button.y);

    app.stage.addChild(button, text);
}

function explode(object, enemy, isMissle: boolean) {
    let frames: PIXI.Texture[] = new Array();
    
    if (isMissle === false) {
        doExplosion = false;
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
            app.ticker.remove(movement);
            displayGameOver();
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

function checkTargetHit(missle: Character, enemy: Character) {
    if (isCollide(missle.getBounds(), enemy.getBounds()) === true) {
        missles = missles.filter(m => m !== missle);
        app.stage.removeChild(missle);

        explode(missle, enemy, true);

        enemies = enemies.filter(e => e !== enemy);
        app.stage.removeChild(enemy);

        score++;
        message.text = 'Score: ' + score;
    }
}


function isCollide(missle, enemy) {
    return missle.x + missle.width / 2 >= enemy.x && missle.x <= enemy.x + enemy.width && missle.y + missle.height >= enemy.y && missle.y <= enemy.y + enemy.height;
}

function shoot() {
    let missle = new Character(PIXI.loader.resources['images'].textures['missle.png']);
    missle.position.set(player.x + player.x / 2, player.y + player.height / 2);
    app.stage.addChild(missle);
    missles.push(missle);
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
            checkPosition(speed,offset);            
            break;
        case 37:
                player.velocityX = -speed;
                checkPosition(speed,offset);
            break;
        case 38:
                player.velocityY = -speed;
                checkPosition(speed,offset);
            break;
        case 39:
                player.velocityX = speed;
                checkPosition(speed,offset);
            break;
        case 40:
                player.velocityY = speed;
                checkPosition(speed,offset);
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
import Star from "./star";
import Application from "./application";
import Character from "./Character";
import HitTest from "./hitTest";

export default class GamePlay {


    public static spawnEnemy(app: PIXI.Application) {
        Application.intervalId = setInterval(() => {
            this.addEnemy(app);
        }, 2000);
    }

    public static noEnemySpawn() {
        clearInterval(Application.intervalId);
    }

    public static addScoreLabel(app: PIXI.Application) {
        Application.message = new PIXI.Text('Score: 0', { fill: 0xFFFFFF });
        Application.message.position.set(10, 10);
        app.stage.addChild(Application.message);
    }

    private static addEnemy(app: PIXI.Application) {
        let enemy = new PIXI.Sprite(PIXI.loader.resources['images'].textures['alien.png']);
        enemy.scale.set(0.15, 0.15);
        enemy.position.set(app.view.width, Application.randomNumber(enemy.height, 600 - enemy.height));
        Application.enemies.push(enemy);
        app.stage.addChild(enemy);
    }

    public static drawStars(app: PIXI.Application) {
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

    public static createPlayer(app: PIXI.Application) {
        Application.player = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
        Application.player.position.set(75, app.view.height / 2);
        Application.player.velocityX = 0;
        Application.player.velocityY = 0;
        app.stage.addChild(Application.player);
    }

    public static shoot(app: PIXI.Application) {
        let missle = new PIXI.Sprite(PIXI.loader.resources['images'].textures['missle.png']);
        missle.position.set(Application.player.x + Application.player.width / 2, Application.player.y + Application.player.height / 2);
        app.stage.addChild(missle);

        Application.missles.push(missle);
    }

    public static checkPosition(speed: number, offset: number, app: PIXI.Application) {
        if (Application.player.x - speed * offset <= 0) {
            Application.player.x = speed * offset;
        } else if (Application.player.y - speed * offset <= 0) {
            Application.player.y = speed * offset;
        } else if (Application.player.x + Application.player.width + speed * offset >= app.view.width) {
            Application.player.x = app.view.width - speed * offset - Application.player.width;
        } else if (Application.player.y + Application.player.height + speed * offset >= app.view.height) {
            Application.player.y = app.view.height - speed * offset - Application.player.height;
        }
    }

    public static checkTargetHit(missle: PIXI.Sprite, enemy: PIXI.Sprite, app: PIXI.Application) {
        if (HitTest.isCollide(missle.getBounds(), enemy.getBounds()) === true) {
            Application.missles = Application.missles.filter(m => m !== missle);
            app.stage.removeChild(missle);

            Application.enemies = Application.enemies.filter(e => e !== enemy);
            app.stage.removeChild(enemy);

            Application.score++;
            Application.message.text = 'Score: ' + Application.score;
            this.drawParticles(enemy, app)
        }
    }

    private static drawParticles(object: PIXI.Sprite, app: PIXI.Application) {
        let particles: Array<PIXI.Sprite> = new Array();
        let container = new PIXI.Container();

        for (let i = 0; i < object.height; i += 5) {
            for (let j = 0; j < object.width; j += 5) {
                let particle = new PIXI.Sprite(PIXI.loader.resources['resources/images/circle.png'].texture);
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

}
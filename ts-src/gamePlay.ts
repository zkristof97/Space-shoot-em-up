import Application from "./application";
import Character from "./Character";
import HitTest from "./hitTest";
import Sounds from "./sound";
import Parallax from "./parallax";

export default class GamePlay {
    public static parallaxImgs: Array<Parallax>;

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
        enemy.scale.set(0.15);
        enemy.position.set(app.view.width, Application.randomNumber(enemy.height, app.view.height - enemy.height));
        Application.enemies.push(enemy);
        app.stage.addChild(enemy);
    }

    public static initBackground(app: PIXI.Application) {
        this.parallaxImgs = new Array();
        for (let i = 6; i >= 1; i--) {
            let texture = PIXI.Texture.fromImage('bg' + i + '.png');
            let bg = new Parallax(texture, app.view.width, app.view.height);
            
            if(i > 3){
                bg.moveBy = 0.39;
            }else {
                bg.moveBy = 1.4; 
            }

            bg.tilePosition.set(0);
            app.stage.addChild(bg);
            this.parallaxImgs.push(bg);
        }
    }

    public static createPlayer(app: PIXI.Application) {
        Application.player = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
        Application.player.position.set(75, app.view.height / 2);
        Application.player.velocityX = 0;
        Application.player.velocityY = 0;
        app.stage.addChild(Application.player);
    }

    public static checkPosition(speed: number, offset: number, app: PIXI.Application) {
        if (Application.player.x - speed * offset <= 0) {
            Application.player.x = speed * offset;
        } 
        if (Application.player.y  <=  speed * offset) {
            Application.player.y = speed * offset;
        }
        if (Application.player.x + Application.player.width + speed * offset >= app.view.width) {
            Application.player.x = app.view.width - speed * offset - Application.player.width;
        }
        if (Application.player.y + Application.player.height + speed * offset >= app.view.height) {
            Application.player.y = app.view.height - speed * offset - Application.player.height;
        }
    }

    public static checkTargetHit(missle: PIXI.Sprite, enemy: PIXI.Sprite, app: PIXI.Application) {
        if (HitTest.isCollide(missle.getBounds(), enemy.getBounds()) === true) {
            Sounds.playExplosionSound(0.05);

            Application.missles = Application.missles.filter(m => m !== missle);
            app.stage.removeChild(missle);

            Application.enemies = Application.enemies.filter(e => e !== enemy);
            app.stage.removeChild(enemy);

            Application.score++;
            Application.message.text = 'Score: ' + Application.score;
            this.drawParticles(enemy, app)
        }
    }

    public static drawParticles(enemy: PIXI.Sprite, app: PIXI.Application) {
        let particles: Array<PIXI.Sprite> = new Array();
        let container = new PIXI.Container();

        for (let i = 0; i < enemy.height; i += 5) {
            for (let j = 0; j < enemy.width; j += 5) {
                let particle = new PIXI.Sprite(PIXI.loader.resources['resources/images/circle.png'].texture);
                particle.position.set(j, i);
                particle.tint = 0xff0000;
                particle.scale.set(0.01);
                particles.push(particle);
                container.addChild(particle);
            }
        }

        container.position.set(enemy.x, enemy.y);
        app.stage.addChild(container);
        let mask = new PIXI.Graphics().beginFill(0xFFFFF).drawCircle(container.width / 2, container.height / 2, 35).endFill();
        container.addChild(mask);
        container.mask = mask;

        app.ticker.add(function particlesFade(){
            for (let j = 0; j < particles.length; j++) {
                if(Application.randomNumber(0,1) === 0){
                    particles[j].x--;
                }else{
                    particles[j].y++;
                }
                if(particles[j].x < 0 || particles[j].y > container.mask.height){
                    container.removeChild(particles[j]);
                    particles = particles.filter(p => p !== particles[j]);
                }
            }
            if(particles.length === 0){
                app.ticker.remove(particlesFade);
                app.stage.removeChild(container);
            }
        });
    }

}
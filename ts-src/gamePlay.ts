import * as PIXI from 'pixi.js';
import Application from "./application";
import Player from "./Character";
import HitTest from "./hitTest";
import Sounds from "./sound";
import Parallax from "./parallax";
import Panel from "./panel";
import Movement from './movement';

export default class GamePlay {
    public static parallaxImgs: Array<Parallax>;

    //calls the functions that are necessary for the game to be playable
    public static initPlay(app: PIXI.Application): void{
        app.stage.removeChildren();

        //initializing new arrays so that when we restart the game, 
        //we don't have missles or enemies left over from the previous game
        Application.missles = new Array();
        Application.enemies = new Array();
        
        this.initBackground(app);
        this.addScoreLabel(app);
        this.spawnEnemy(app);
        this.createPlayer(app);
        
        Panel.addPauseBtn(app);
    }

    //when called spawns enemies
    public static spawnEnemy(app: PIXI.Application): void {
        Application.intervalId = setInterval(() => {
            if(document.hasFocus() === true){
                let enemy: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['alien.png']);
    
                enemy.position.set(app.view.width, Application.randomNumber(enemy.height, app.view.height - enemy.height));
    
                enemy.scale.set(0.15);
                
                Application.enemies.push(enemy);
    
                app.stage.addChild(enemy);
            }
        }, 2000);
    }

    //stops enemy spawning
    public static noEnemySpawn(): void {
        clearInterval(Application.intervalId);
    }

    //adds the score label to the game screen that tracks how many aliens we have killed so far
    private static addScoreLabel(app: PIXI.Application): void {
        Application.score = 0;

        Application.message = new PIXI.Text('Score: ' + Application.score, { fill: 0xFFFFFF });

        Application.message.position.set(10, 10);

        app.stage.addChild(Application.message);
    }

    //creates the parallax scrolling background from 6 layers
    private static initBackground(app: PIXI.Application): void {
        this.parallaxImgs = new Array();

        for (let i = 6; i >= 1; i--) {
            let texture: PIXI.Texture = PIXI.Texture.fromImage('bg' + i + '.png');

            let bg: Parallax = new Parallax(texture, app.view.width, app.view.height);

            switch (i) {
                case 1:
                    bg.velocity = 1.7;
                    break;
                case 2:
                    bg.velocity = 1.16;
                    break;
                case 3:
                    bg.velocity = 0.7;
                    break;
                case 4:
                    bg.velocity = 0.53;
                    break;
                case 5:
                    bg.velocity = 0.29;
                    break;
                case 6:
                    bg.velocity = 0.2;
                    break;
            }

            bg.tilePosition.set(0);

            this.parallaxImgs.push(bg);

            app.stage.addChild(bg);
        }
    }

    //creates our player object
    private static createPlayer(app: PIXI.Application): void {
        Application.player = new Player(PIXI.loader.resources['images'].textures['craft.png']);

        Application.player.position.set(75, app.view.height / 2);

        app.stage.addChild(Application.player);
    }

    //checks to see if player has gone out of bounds, if yes puts it back in position
    public static checkPosition(speed: number, offset: number, app: PIXI.Application): void {
        if (Application.player.x - speed * offset <= 0) {
            
            Application.player.x = speed * offset;

        }
        if (Application.player.y <= speed * offset) {
            
            Application.player.y = speed * offset;

        }
        if (Application.player.x + Application.player.width + speed * offset >= app.view.width) {

            Application.player.x = app.view.width - speed * offset - Application.player.width;

        }
        if (Application.player.y + Application.player.height + speed * offset >= app.view.height) {
            
            Application.player.y = app.view.height - speed * offset - Application.player.height;

        }
    }

    //checks if a missle has hit an enemy
    public static checkTargetHit(missle: PIXI.Sprite, enemy: PIXI.Sprite, app: PIXI.Application): void {
        if (HitTest.isCollide(missle.getBounds(), enemy.getBounds()) === true) {
            //setting it to true because of speed up
            Movement.doIncreaseSpeed = true;

            Sounds.playExplosionSound(0.05);

            //removing missle and enemy that collided
            app.stage.removeChild(missle);
            Application.missles = Application.missles.filter(m => m !== missle);
            
            app.stage.removeChild(enemy);
            Application.enemies = Application.enemies.filter(e => e !== enemy);

            Application.score++;
            Application.message.text = 'Score: ' + Application.score;

            this.drawParticles(enemy, app)
        }
    }

    //drawing particles that appear if a missle has successfully destroyed an alien
    private static drawParticles(enemy: PIXI.Sprite, app: PIXI.Application): void {
        let particles: Array<PIXI.Sprite> = new Array();

        //container that holds our particles
        let container: PIXI.Container = new PIXI.Container();

        container.position.set(enemy.x, enemy.y);

        app.stage.addChild(container);

        //creating particles
        for (let i = 0; i < enemy.height; i += 5) {
            for (let j = 0; j < enemy.width; j += 5) {
                let particle: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['circle.png']);

                particle.position.set(j, i);

                particle.scale.set(0.01);

                particle.tint = 0xff0000;
                
                particles.push(particle);

                container.addChild(particle);
            }
        }

        //masking the container so that particles will form a circular shape
        let mask: PIXI.Graphics = new PIXI.Graphics().beginFill(0xFFFFF).drawCircle(container.width / 2, container.height / 2, 35).endFill();

        container.addChild(mask);

        container.mask = mask;

        app.ticker.add(function particlesFade() {
            //moving particles
            for (let j = 0; j < particles.length; j++) {
                if (Application.randomNumber(0, 1) === 0) {

                    particles[j].x--;

                } else {
                    
                    particles[j].y++;

                }
                //remove particles that left the explosion area
                if (particles[j].x < 0 || particles[j].y > container.mask.height) {

                    container.removeChild(particles[j]);

                    particles = particles.filter(p => p !== particles[j]);
                }
            }
            //remove container when all particles have disappeared
            if (particles.length === 0) {
                app.ticker.remove(particlesFade);

                app.stage.removeChild(container);
            }
        });
    }
}
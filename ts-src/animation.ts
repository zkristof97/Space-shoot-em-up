import * as PIXI from 'pixi.js';
import Application from "./application";
import Character from "./Character";
import Sounds from "./sound";

export default class Animation {

    public static moon(app: PIXI.Application): void {
        let frames: PIXI.Texture[] = new Array();

        for (let i = 1; i <= 48; i++) {
            frames.push(PIXI.Texture.fromFrame('moon' + i + '.png'));
        }

        let moon = new PIXI.extras.AnimatedSprite(frames);

        moon.position.set(0, 30);

        moon.scale.set(0.8);

        moon.animationSpeed = 7 / 60;

        moon.play();

        app.stage.addChild(moon);
    }

    public static missle(app: PIXI.Application) {
        if (Application.movementOn === true) {
            let frames: PIXI.Texture[] = new Array();

            for (let i = 4; i <= 7; i++) {
                frames.push(PIXI.Texture.fromFrame('missle' + i + '.png'));
            }

            let missle = new PIXI.extras.AnimatedSprite(frames);

            missle.position.set(Application.player.x + Application.player.width / 2, Application.player.y + Application.player.height / 2);

            missle.width = missle.width / 2;

            missle.animationSpeed = 16 / 60;

            missle.play();

            Sounds.playMissleSound();

            Application.missles.push(missle);

            app.stage.addChild(missle);
        }
    }

    public static explode(player: Character, app: PIXI.Application) {
        Sounds.playExplosionSound(0.2);

        Application.movementOn = false;

        let frames: PIXI.Texture[] = new Array();

        for (let i = 1; i <= 11; i++) {
            let index = i < 10 ? '0' + i : i;

            frames.push(PIXI.Texture.fromFrame('boom' + index + '.png'));
        }

        let explosion = new PIXI.extras.AnimatedSprite(frames)

        explosion.position.set(player.x + 100, player.y);

        explosion.anchor.set(0.5);

        explosion.animationSpeed = 11 / 60;

        explosion.loop = false;

        explosion.play();

        explosion.onComplete = () => {
            app.stage.removeChild(explosion);
            Application.state = 'gameOver';
        };

        app.stage.addChild(explosion);
    }
}
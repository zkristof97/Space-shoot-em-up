import Application from "./application";
import Character from "./Character";
import Sounds from "./sound";

export default class Animation {
    public static moon(app: PIXI.Application): void {
        let frames: PIXI.Texture[] = new Array();
        for (let i = 1; i <= 48; i++) {

            frames.push(PIXI.Texture.fromFrame('moon' + i + '.png'));
        }

        let animation = new PIXI.extras.AnimatedSprite(frames);
        animation.position.set(0, 30);
        animation.scale.set(0.8);
        animation.animationSpeed = 7 / 60;
        animation.play();
        app.stage.addChild(animation);
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

            app.stage.addChild(missle);

            Application.missles.push(missle);
        }
    }

    public static explode(player: Character, enemy: PIXI.Sprite, app: PIXI.Application) {
        Application.movementOn = false;
        let frames: PIXI.Texture[] = new Array();

        Sounds.playExplosionSound(0.2);
        Application.doExplosion = false;

        app.stage.removeChild(player);
        app.stage.removeChild(enemy);

        for (let i = 1; i <= 11; i++) {
            let index = i < 10 ? '0' + i : i;
            frames.push(PIXI.Texture.fromFrame('boom' + index + '.png'));
        }

        let anim = new PIXI.extras.AnimatedSprite(frames)
        anim.loop = false;
        anim.anchor.set(0.5);
        anim.animationSpeed = 11 / 60;
        anim.position.set(player.x + 100, player.y);
        anim.play();
        app.stage.addChild(anim);

        anim.onComplete = () => {
            app.stage.removeChild(anim);
            Application.state = 'gameOver';
        };
    }
}
import Application from "./application";
import Character from "./Character";

export default class Animation{
    public static moon(app: PIXI.Application): void {
        /* let frames: PIXI.Texture[] = new Array();
        for (let i = 1; i <= 48; i++) {
            let index = i < 10 ? '0' + i : i;

            frames.push(PIXI.Texture.fromFrame(index + '.png'));
        }
        let animation = new PIXI.extras.AnimatedSprite(frames);
        animation.scale.set(0.9);
        animation.animationSpeed = 10 / 60;
        animation.play();
        app.stage.addChild(animation); */

        let frames: PIXI.Texture[] = new Array();
        for (let i = 1; i <= 48; i++) {

            frames.push(PIXI.Texture.fromFrame('moon' + i + '.png'));
        }

        let animation = new PIXI.extras.AnimatedSprite(frames);
        animation.scale.set(0.9);
        animation.animationSpeed = 10 / 60;
        animation.play();
        app.stage.addChild(animation);

        /* let moon = new PIXI.Sprite(PIXI.loader.resources['nevtelen'].texture);
        moon.scale.set(0.7);
        app.stage.addChild(moon); */
    }

    public static missle(app: PIXI.Application){
        let frames: PIXI.Texture[] = new Array();
        for (let i = 4; i <= 7; i++) {

            frames.push(PIXI.Texture.fromFrame('missle' + i + '.png'));
        }

        let missle = new PIXI.extras.AnimatedSprite(frames);
        missle.position.set(Application.player.x + Application.player.width / 2, Application.player.y + Application.player.height / 2);
        missle.width = missle.width / 2;
        missle.animationSpeed = 16/60;
        missle.play();
        app.stage.addChild(missle);

        Application.missles.push(missle);
    }

    public static explode(player: Character, enemy: PIXI.Sprite, app:PIXI.Application) {
        let frames: PIXI.Texture[] = new Array();
    
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
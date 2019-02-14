import Application from "./application";
import Character from "./Character";

export default class Animation{
    //moon
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
            /* app.ticker.remove(movements); */
            Application.state = 'gameOver';
        };
    }
}
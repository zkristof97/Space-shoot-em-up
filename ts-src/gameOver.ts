import * as PIXI from 'pixi.js';
import Application from "./application";

export default class GameOver {

    public static display(app: PIXI.Application) {
        let gameOver = new PIXI.Sprite(PIXI.loader.resources['images'].textures['game-over.png']);

        gameOver.position.set(app.view.width / 2, app.view.height / 2);

        gameOver.anchor.set(0.5);

        app.stage.addChild(gameOver);
        
        this.addBackToMenuBtn(gameOver, app);
    }

    private static addBackToMenuBtn(gameOverSign: PIXI.Sprite, app: PIXI.Application) {
        let button = new PIXI.Sprite(PIXI.loader.resources['images'].textures['button.png']);

        button.position.set(app.view.width / 2, app.view.height / 2 + gameOverSign.height / 2 + 50);

        button.anchor.set(0.5);

        button.scale.set(0.5);

        button.interactive = true;

        button.addListener('click', () => {
            Application.state = 'menu';
        });

        let text = new PIXI.Text('Back');

        text.position.set(button.x, button.y);
        
        text.anchor.set(0.5);

        app.stage.addChild(button, text);
    }
}
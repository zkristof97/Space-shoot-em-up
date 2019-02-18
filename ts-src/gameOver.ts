import * as PIXI from 'pixi.js';
import Application from "./application";

export default class GameOver {

    //displays the game over sign
    public static display(app: PIXI.Application): void {
        let gameOver: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['game-over.png']);

        gameOver.position.set(app.view.width / 2, app.view.height / 2);

        gameOver.anchor.set(0.5);

        app.stage.addChild(gameOver);
        
        this.addBackToMenuBtn(gameOver, app);
    }

    //adds a button below the game over sign that lets us go back to the menu
    private static addBackToMenuBtn(gameOverSign: PIXI.Sprite, app: PIXI.Application): void {
        let button: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['button.png']);

        button.position.set(app.view.width / 2, app.view.height / 2 + gameOverSign.height / 2 + 50);

        button.anchor.set(0.5);

        button.scale.set(0.5);

        button.interactive = true;

        button.addListener('click', () => {
            Application.state = 'menu';
        });

        let text: PIXI.Text = new PIXI.Text('Back');

        text.position.set(button.x, button.y);
        
        text.anchor.set(0.5);

        app.stage.addChild(button, text);
    }
}
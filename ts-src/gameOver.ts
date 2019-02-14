import Application from "./application";

export default class GameOver{
    public static display(app: PIXI.Application) {
        let gameOver = new PIXI.Sprite(PIXI.loader.resources['game-over'].texture);
        gameOver.anchor.set(0.5);
        gameOver.x = app.view.width / 2;
        gameOver.y = app.view.height / 2;
        app.stage.addChild(gameOver);
        this.addBackToMenuBtn(gameOver, app);
    }
    
    private static addBackToMenuBtn(gameOverSign: PIXI.Sprite, app: PIXI.Application) {
        let button = new PIXI.Sprite(PIXI.loader.resources['button'].texture);
        button.anchor.set(0.5);
        button.scale.set(0.5);
        button.position.set(app.view.width / 2, app.view.height / 2 + gameOverSign.height / 2 + button.height);
        button.interactive = true;
        button.addListener('click', () => {
            Application.state = 'menu';
        });
    
        let text = new PIXI.Text('Back');
        text.anchor.set(0.5);
        text.position.set(button.x, button.y);
    
        app.stage.addChild(button, text);
    }
}
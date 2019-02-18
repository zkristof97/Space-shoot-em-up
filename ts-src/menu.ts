import * as PIXI from 'pixi.js';
import Application from './application';
import Animation from './animation';

export default class Menu {

    public static buttons: Array<PIXI.Sprite>;

    //creates the menu
    public static init(app: PIXI.Application): void {
        app.stage.removeChildren();

        this.loadBackground(app);
        this.loadLogo(app);
        this.loadButtons(app);

        Animation.moon(app);
    }

    //creates the logo that is displayed above the buttons
    private static loadLogo(app: PIXI.Application): void {
        let logo: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['logo.png']);

        logo.position.set(410, 110);

        logo.scale.set(0.45);

        app.stage.addChild(logo);
    }

    //creates buttons
    private static loadButtons(app: PIXI.Application): void {
        this.buttons = new Array();

        for (let i = 0; i < 4; i++) {
            let button: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['button.png']);

            button.anchor.set(0.5);
            button.scale.set(0.5);

            button.position.set(app.view.width - button.width * 1.42, app.view.height / 2 + (i * 60))

            button.interactive = true;

            switch (i) {
                case 3:
                    button.addListener('click', () => {
                        Application.state = 'exit';
                    });
                    break;

                default:
                    button.addListener('click', () => {
                        Application.state = 'play';
                    });
                    break;
            }

            this.buttons.push(button);

            app.stage.addChild(button);
        }

        this.addBtnText(app);
    }

    //adds label onto the buttons 
    private static addBtnText(app: PIXI.Application): void {
        let text: PIXI.Text;

        for (let i = 0; i < 4; i++) {

            switch (i) {
                case 3:
                    text = new PIXI.Text('EXIT');
                    break;

                default:
                    text = new PIXI.Text('GAME' + (i + 1));
                    break;
            }

            text.position.set(this.buttons[i].x, this.buttons[i].y);

            text.anchor.set(0.5);

            app.stage.addChild(text);
        }
    }

    //loads the background and resizes it to the desired dimensions
    private static loadBackground(app: PIXI.Application): void {
        let background: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['cosmos-bg.png']);

        background.width = 800;
        background.height = 600;

        app.stage.addChild(background);
    }
}
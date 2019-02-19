import * as PIXI from 'pixi.js';
import Application from "./application";

export default class Panel {

    //disables the pause button when game is over
    public static deactivatePauseBtn() {
        Application.pauseBtn.interactive = false;
    }

    //adds the pause button that is located in the bottom right corner, and allows us to stop, replay, or continue our game
    public static addPauseBtn(app: PIXI.Application): void {
        let pauseBtn: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['images'].textures['pauseBtn.png']);

        pauseBtn.position.set(app.view.width - 15, app.view.height - 15);

        pauseBtn.scale.set(0.08);

        pauseBtn.anchor.set(1, 1);

        pauseBtn.tint = 0xFFFFFF;

        pauseBtn.interactive = true;

        pauseBtn.addListener('click', () => {
            if (Application.shouldPause === true) {

                Application.state = 'pause';

            } else {

                Application.state = 'unpause';

            }
        });

        Application.pauseBtn = pauseBtn;

        app.stage.addChild(pauseBtn);
    }

    //shows the panel that contains the play etc. buttons
    public static showPanel(app: PIXI.Application): void {
        Application.panel = new PIXI.Sprite(PIXI.loader.resources['images'].textures['panel.png']);

        Application.panel.position.set(app.view.width / 2, app.view.height / 2);

        Application.panel.anchor.set(0.5);

        app.stage.addChild(Application.panel);

        this.addPanelBtns(app);
    }

    //hides the panel
    public static hidePanel(app: PIXI.Application){
        Application.shouldPause = true;

        app.stage.removeChild(Application.panel);

        for (let i = 0; i < Application.panelButtons.length; i++) {
            let currentButton = Application.panelButtons[i];

            app.stage.removeChild(currentButton);

            Application.panelButtons = Application.panelButtons.filter(p => p !== currentButton);
        }

        if (Application.panelButtons.length === 1) {
            app.stage.removeChild(Application.panelButtons[0]);

            Application.panelButtons.pop();
        }
    }

    //adds the buttons that are displayed on the panel
    private static addPanelBtns(app: PIXI.Application): void {
        let stopBtn = new PIXI.Sprite(PIXI.loader.resources['images'].textures['stopBtn.png']);

        stopBtn.setParent(Application.panel);

        stopBtn.position.set(stopBtn.parent.x - stopBtn.parent.width / 2 + 100, stopBtn.parent.y);

        stopBtn.anchor.set(0.5);

        stopBtn.scale.set(0.8);

        stopBtn.interactive = true;

        stopBtn.addListener('click', () => {
            Application.state = 'stop';
        });

        let playBtn = new PIXI.Sprite(PIXI.loader.resources['images'].textures['playBtn.png']);

        playBtn.setParent(Application.panel);

        playBtn.position.set(playBtn.parent.x, playBtn.parent.y);

        playBtn.anchor.set(0.5);

        playBtn.scale.set(0.4);

        playBtn.interactive = true;

        playBtn.addListener('click', () => {
            Application.state = 'unpause';
        });

        let replayBtn = new PIXI.Sprite(PIXI.loader.resources['images'].textures['replayBtn.png']);

        replayBtn.setParent(Application.panel);

        replayBtn.scale.set(0.32);

        replayBtn.position.set(replayBtn.parent.x + replayBtn.width * 1.5, replayBtn.parent.y);

        replayBtn.anchor.set(0.5);

        replayBtn.interactive = true;

        replayBtn.addListener('click', () => {
            Application.isReplay = true;

            Application.state = 'stop';
        });

        Application.panelButtons.push(replayBtn, playBtn, stopBtn);

        app.stage.addChild(replayBtn, playBtn, stopBtn);
    }
}
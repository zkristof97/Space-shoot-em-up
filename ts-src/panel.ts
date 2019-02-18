import Application from "./application";

export default class Panel {

    public deactivatePauseBtn(){
        Application.pauseBtn.interactive = false;
    }

    public static addPauseBtn(app: PIXI.Application): void {
        let pauseBtn = new PIXI.Sprite(PIXI.loader.resources['pauseBtn'].texture);
        pauseBtn.anchor.set(1, 1);
        pauseBtn.scale.set(0.08);
        pauseBtn.tint = 0xFFFFFF;
        pauseBtn.position.set(app.view.width - 15, app.view.height - 15);
        pauseBtn.interactive = true;
        pauseBtn.addListener('click', () => {
            if(Application.shouldPause === true){
                Application.state = 'pause';
            }else{
                Application.state = 'unpause';
            }
        });
        app.stage.addChild(pauseBtn);
        Application.pauseBtn = pauseBtn;
    }

    public showPanel(shouldShow: boolean, app: PIXI.Application) {
        if (shouldShow === true) {
            Application.panel = new PIXI.Sprite(PIXI.loader.resources['panel'].texture);
            Application.panel.anchor.set(0.5);
            Application.panel.position.set(app.view.width / 2, app.view.height / 2);
            app.stage.addChild(Application.panel);
            this.addPanelBtns(app);
        }
        else {
            Application.shouldPause = true;
            app.stage.removeChild(Application.panel);

            for (let i = 0; i < Application.panelButtons.length; i++) {
                let currentButton = Application.panelButtons[i];
                Application.panelButtons = Application.panelButtons.filter(p => p !== currentButton);
                app.stage.removeChild(currentButton);
            }

            if (Application.panelButtons.length === 1) {
                app.stage.removeChild(Application.panelButtons[0]);
                Application.panelButtons.pop();
            }

        }
    }

    private addPanelBtns(app: PIXI.Application) {
        let stopBtn = new PIXI.Sprite(PIXI.loader.resources['stopBtn'].texture);
        stopBtn.scale.set(0.8);
        stopBtn.setParent(Application.panel);
        stopBtn.position.set(stopBtn.parent.x - stopBtn.parent.width / 2 + 100, stopBtn.parent.y);
        stopBtn.anchor.set(0.5);
        stopBtn.interactive = true;
        stopBtn.addListener('click', () =>{
            Application.state = 'stop';
        });

        let playBtn = new PIXI.Sprite(PIXI.loader.resources['playBtn'].texture);
        playBtn.scale.set(0.4);
        playBtn.setParent(Application.panel);
        playBtn.position.set(playBtn.parent.x, playBtn.parent.y);
        playBtn.anchor.set(0.5);
        playBtn.interactive = true;
        playBtn.addListener('click', () =>{
            Application.state = 'unpause';
        });

        let replayBtn = new PIXI.Sprite(PIXI.loader.resources['replayBtn'].texture);
        replayBtn.scale.set(0.32);
        replayBtn.setParent(Application.panel);
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
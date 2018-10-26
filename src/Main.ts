class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {
                foundation.TickManager.Tick(egret.getTimer());
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        UILocator.Init(this);
        let stateMachine=new foundation.StateMachine();
        stateMachine.addState(new ScenePreload());
        stateMachine.addState(new SceneGame());

        stateMachine.currentState=ScenePreload.TYPE;
    }
}
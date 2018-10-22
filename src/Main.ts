class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })

    }

    private async runGame() {
        UILocator.Init(this);
        //Facade.RegisterModule(BagMediator,BagView,gameSDK.BagProxy);

        let bagMediator:gameSDK.BagMediator=Facade.GetMediator(gameSDK.BagMediator);
        bagMediator.toggleSelf(1);
        bagMediator.fuck();

        let mediator=Facade.ToggleMediator(SkillMediator);
        mediator.fuck();

        let t=<IStream>{code:1000};
        SocketX.Dispatch(t);


        t={code:1920} as IStream;
        SocketX.Dispatch(t);

        Facade.SimpleDispatch(EventX.READY,"hello");
    }
}
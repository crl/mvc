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


        let loader:egret.URLLoader=new egret.URLLoader();
        loader.dataFormat=egret.URLLoaderDataFormat.TEXT;
        loader.addEventListener(egret.Event.COMPLETE,this.defHandle,this);
        let url="./manifestDef.json";
        let request=new egret.URLRequest(url);
        loader.load(request);
    }

    private defHandle(event:egret.Event){
        let loader:egret.URLLoader=event.target;
        let o=JSON.parse(loader.data);
        mvc.MVCInject.InitMVCInjectDef(o);
        
        this.runGame().catch(e => {
            DebugX.LogError(e);
        })
    }

    private async runGame() {
        UILocator.Init(this);

        mvc.Singleton.RegisterMulitClass(gameSDK.BagMediator,gameSDK.BagProxy);
        mvc.Singleton.RegisterMulitClass(SkillMediator,gameSDK.SkillProxy);
        mvc.Singleton.RegisterClass(BagView);
        mvc.Singleton.RegisterClass(SkillView);
        //Facade.RegisterModule(BagMediator,BagView,gameSDK.BagProxy);

        let mediator=Facade.ToggleMediator(SkillMediator);
        mediator.fuck();
        
        let bagMediator=Facade.GetMediator(gameSDK.BagMediator);
        //bagMediator.toggleSelf(1);
        bagMediator.fuck();

        let t=<IStream>{code:1000};
        SocketX.Dispatch(t);


        t={code:1920} as IStream;
        SocketX.Dispatch(t);

        Facade.SimpleDispatch(EventX.READY,"hello");
    }
}
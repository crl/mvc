class SceneGame extends foundation.SceneBase {
    static readonly TYPE: string = "SceneGame";
    constructor() {
        super(SceneGame.TYPE);
    }
    awaken() {
        this.runGame().catch(e => {
            DebugX.LogError(e);
        })
    }

    private async runGame() {


        mvc.Singleton.RegisterMulitClass(gameSDK.BagMediator, gameSDK.BagProxy);
        mvc.Singleton.RegisterMulitClass(SkillMediator, gameSDK.SkillProxy);
        mvc.Singleton.RegisterClass(BagView);
        mvc.Singleton.RegisterClass(SkillView);

        let mediator = Facade.ToggleMediator(SkillMediator);
        mediator.fuck();

        let bagMediator = Facade.GetMediator(gameSDK.BagMediator);
        //bagMediator.toggleSelf(1);
        bagMediator.fuck();

        let t = <IStream>{ code: 1000 };
        SocketX.Dispatch(t);


        t = { code: 1920 } as IStream;
        SocketX.Dispatch(t);

        Facade.SimpleDispatch(EventX.READY, "hello");

    }
}
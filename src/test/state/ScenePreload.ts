class ScenePreload extends foundation.SceneBase {
    static readonly TYPE: string = "ScenePreload";
    constructor() {
        super(ScenePreload.TYPE);
        
        this._nextState = SceneGame.TYPE;
    }
    awaken() {

        let loader: egret.URLLoader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader.addEventListener(egret.Event.COMPLETE, this.defHandle, this);
        let url = "./manifestDef.json";
        let request = new egret.URLRequest(url);
        loader.load(request);
    }

    private defHandle(event: egret.Event) {
        let loader: egret.URLLoader = event.target;
        let o = JSON.parse(loader.data);
        mvc.MVCInject.InitMVCInjectDef(o);

       
        this.sleep();
    }
}
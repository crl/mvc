class BagView extends mvc.AbstactPanel implements mvc.IInjectable {

	private s:egret.Sprite;
	protected color:number=0;
	protected tx:number=0;
	__injectable=true;

	@MVC
	private bagModel:gameSDK.BagProxy;

	@MVC
	private view:gameSDK.SkillProxy;
	public constructor() {
		super();
		this.create();
	}
	protected create(){
		this.s=new egret.Sprite();
		let g=this.s.graphics;
		g.beginFill(this.color);
		g.drawRect(this.tx,0,200,100);
		g.endFill();
		this.s.touchEnabled=true;
		this.s.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tapHandle,this);
		this.s.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tapHandle2,this);


		let tf=new egret.TextField();
		tf.size=24;
		tf.x=this.tx;
		tf.width=this.s.width;
		tf.height=100;
		tf.text="inject:"+mvc.Singleton.GetClassFullName(this);

		
		this.addChild(this.s);
		this.addChild(tf);
	}
	tapHandle2(TOUCH_TAP: string, tapHandle2: any, arg2: this): any {
		this.simpleDispatch(EventX.CLICK);
	}
	
	protected tapHandle(e:egret.TouchEvent){

		foundation.CallLater.Add(this.laterHandle,this,2000);
		
		this.bagModel.fuck(true);
	}
	laterHandle(): any {
		Facade.ToggleMediator(SkillMediator);
	}


	public fuck(){
		console.log("call:",this.name,'fuck',this.bagModel.name);		
	}
}
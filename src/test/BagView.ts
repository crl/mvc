class BagView extends mvc.AbstactPanel {

	private s:egret.Sprite;
	protected color:number=0;
	protected tx:number=0;
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


		let tf=new egret.TextField();
		tf.size=24;
		tf.x=this.tx;
		tf.width=this.s.width;
		tf.height=100;
		tf.text="inject:"+egret.getQualifiedClassName(this);

		
		this.addChild(this.s);
		this.addChild(tf);
	}
	protected tapHandle(e:egret.TouchEvent){

		Facade.ToggleMediator(SkillMediator);
	}
}
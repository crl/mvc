class SkillView extends BagView{

	protected create() {
		this.tx=300;
		this.color=0xFF0000;
		super.create();
	}

	@MVC
	private skillModel:gameSDK.SkillProxy;

	protected tapHandle(e:egret.TouchEvent){

		foundation.CallLater.Add(this.laterHandle,this,5000);
	
		this.skillModel.fuck(true);
	}

	laterHandle(): any {
		Facade.ToggleMediator(gameSDK.BagMediator);
	}
}
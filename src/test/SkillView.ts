class SkillView extends BagView{

	protected create() {
		this.tx=300;
		this.color=0xFF0000;
		super.create();
	}

	protected tapHandle(e:egret.TouchEvent){

		Facade.ToggleMediator(gameSDK.BagMediator);
	}
}
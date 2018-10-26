class SkillMediator extends mvc.Mediator {
	@MVC
	private view: SkillView;

	@MVC
	private proxy: gameSDK.SkillProxy;

	@MVC
	private bagProxy: gameSDK.BagProxy;
	onMediatorReadyHandle() {
		this.view.addEventListener(EventX.CLICK, this.clickHandle, this);
	}
	clickHandle(e: EventX) {
		this.toggleSelf();
	}
	onAwaken() {
		console.log(this.name, "onAwaken");
	}

	public fuck() {
		console.log("call:", this.name, 'fuck');
		this.view.fuck();
		this.proxy.fuck();
	}
	@CMD(1920)
	public cmd(e: IStream) {
		this.bagProxy.fuck();
		console.log("cmd:", this.name, e.code);
	}




	@MVCE(InjectEventType.Show, EventX.MEDIATOR_READY)
	public inject(e: EventX) {
		console.log(this.name, "Show InjectEventType:", e.type, e.data);
	}
}
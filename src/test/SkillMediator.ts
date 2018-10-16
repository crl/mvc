///<reference path="SkillView.ts" />
///<reference path="SkillProxy.ts" />
///<reference path="BagProxy.ts" />

class SkillMediator extends mvc.Mediator {
	@MVC
	private view:SkillView;

	@MVC
	private proxy:gameSDK.SkillProxy;

	@MVC
	private bagProxy:gameSDK.BagProxy;


	public fuck() {
			console.log("call:",this.name,'fuck');
		}
	@CMD(1920)
	public cmd(e:IStream){
		console.log("cmd:",this.name,e.code);
	}


	@MVCE(InjectEventType.Show,EventX.READY)
	public inject(e:EventX){
		console.log("InjectEventType:",this.name,e.type,e.data);
	}
}
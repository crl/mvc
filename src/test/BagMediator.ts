namespace gameSDK {
	
	export class BagMediator extends mvc.Mediator {
		@MVC
		public view:BagView;

		@MVC
		private proxy:BagProxy;

		public fuck() {
			console.log("call:",this.name,'fuck');

			this.view.fuck();
			this.proxy.fuck();
		}

		@CMD(1000)
		public cmd(e:IStream){
			console.log("cmd:",this.name,e.code);
			//this.hello();
		}

		@MVCE(InjectEventType.Always,EventX.READY,EventX.MEDIATOR_READY)
		private inject(e:EventX){
			console.log("InjectEventType:",this.name,e.type,e.data);
		}
	}
}
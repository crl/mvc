module gameSDK {
	export class BagProxy extends mvc.Proxy{
		@MVC
		public skillProxy:SkillProxy;
		public fuck(){
			console.log("call:",this.name,'fuck');
		}
	}
}
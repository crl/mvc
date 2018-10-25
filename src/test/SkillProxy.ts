module gameSDK {
	export class SkillProxy extends mvc.Proxy {

		@MVC
		hello:BagProxy;
		public fuck(){
			console.log("call:",this.name,'fuck');
		}
	}
}
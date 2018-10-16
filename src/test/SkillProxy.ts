module gameSDK {
	export class SkillProxy extends mvc.Proxy {
		public fuck(){
			console.log("call:",this.name,'fuck');
		}
	}
}
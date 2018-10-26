module gameSDK {
	export class SkillProxy extends mvc.Proxy {

		@MVC
		hello:BagProxy;
		public fuck(isAlert:boolean=false){
			if(isAlert){
				DebugX.LogError("call:",this.name,'fuck');
			}else{
				DebugX.Log("call:",this.name,'fuck');
			}
		}
	}
}
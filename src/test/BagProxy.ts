module gameSDK {
	export class BagProxy extends mvc.Proxy{
		@MVC
		public skillProxy:SkillProxy;
		public fuck(isAlert:boolean=false){
			if(isAlert){
				DebugX.LogError("call:",this.name,'fuck');
			}else{
				DebugX.Log("call:",this.name,'fuck');
			}
		}
	}
}
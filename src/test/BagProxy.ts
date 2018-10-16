module gameSDK {
	export class BagProxy extends mvc.Proxy{
		public fuck(){
			console.log("call:",this.name,'fuck');
		}
	}
}
module mvc {
	export class View implements IView {
		protected hostMap: { [index: string]: IMVCHost } = {};
		public constructor(protected facade:IFacade) {}

		public get(name:string ):IMVCHost{
			return this.hostMap[name];
		}

		public register(host:IMVCHost):boolean{
			let name = host.name;
			if (this.hostMap[name]) {
				console.warn("duplicate:"+name);
				return false;
			}
			this.hostMap[ name ] = host;
			this.facade.registerEventInterester(host,InjectEventType.Always,true);
			host.onRegister();	
			return true;		
		}

		public remove(host:IMVCHost){
			let name = host.name;
			if (!this.hostMap[name]) {
				console.warn("not eixst:"+name);
				return false;
			}
			this.hostMap[ name ] = null;
			delete this.hostMap[ name ];

			this.facade.registerEventInterester(host,InjectEventType.Always,false);
			host.onRemove();	
		}
	}
}
module mvc {
	export class View implements IView {
		protected hostMap: { [index: string]: IMVCHost } = {};
		public get(name:string ):IMVCHost{
			return this.hostMap[name];
		}

		public register(host:IMVCHost):boolean{
			let name = host.name;
			if (this.hostMap[name]) {
				DebugX.Warn("duplicate:"+name);
				return false;
			}
			this.hostMap[ name ] = host;
			host.onRegister();	
			return true;		
		}

		public remove(host:IMVCHost){
			let name = host.name;
			if (!this.hostMap[name]) {
				DebugX.Warn("not eixst:"+name);
				return false;
			}
			this.hostMap[ name ] = null;
			delete this.hostMap[ name ];
			host.onRemove();	
		}
	}
}
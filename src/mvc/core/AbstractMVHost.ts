module mvc {
	export abstract class AbstractMVHost extends egret.EventDispatcher implements IMVCHost, IEventInterester, IAsync, egret.IEventDispatcher {
		__eventInteresting:{[index:string]:Array<mvc.InjectEventTypeHandle>};
		
		protected _name: string;
		public get name() {
			return this._name;
		}

		protected facade: IFacade = Facade.GetInstance();
		protected _isReady: boolean = false;
		protected readyHandle: ListenerItemBox<EventX>[];

		public get isReady(): boolean {
			return this._isReady;
		}

		public startSync(): boolean {
			if (this._isReady == false) {
				this.load();
			}
			return true;
		}
		protected load(){
			
		}

		public addReayHandle(handle: (e: EventX) => void,thisObj?:any): boolean {
			if (this._isReady) {
				handle(EventX.ReadyEventX);
				return true;
			}

			if (!this.readyHandle) {
				this.readyHandle = new Array<ListenerItemBox<EventX>>();
			} else {
				for(let item of this.readyHandle){
					if(item.handle==handle){
						return false;
					}
				}
			}
			this.readyHandle.push(new ListenerItemBox(handle,thisObj));
			return true;
		}
		public removeReayHandle(handle: (e: EventX) => void,thisObj?:any): boolean {
			if (this._isReady) {
				return false;
			}

			if (this.readyHandle) {
				let len=this.readyHandle.length;
				for(let i=0;i<len;i++){
					let item=this.readyHandle[i];
					if(item.handle==handle && item.thisObj==thisObj){
						this.readyHandle.splice(i, 1);
					}
					return true;
				}
			}

			return false;
		}

		protected dispatchReayHandle() {
		
			if (this.readyHandle != null) {
				this.readyHandle.forEach((val, index, list) => {
					val.handle.call(val.thisObj, EventX.ReadyEventX);
				});
				this.readyHandle.length=0;
				this.readyHandle=null;
			}
			this.dispatchEvent(EventX.ReadyEventX);
		}

		public getEventInterests(type: InjectEventType): Array<InjectEventTypeHandle> {
			if(!this.__eventInteresting){
				return null;
			}
			return this.__eventInteresting[type];
		}

		public onRegister() {

		}
		public onRemove() {

		}
	}
}
module mvc {
	export abstract class AbstractMVHost extends egret.EventDispatcher implements IMVCHost, IEventInterester, IAsync, egret.IEventDispatcher {
		public __eventInteresting:{[index:string]:Array<mvc.InjectEventTypeHandle>};
		protected static ReadyEventX: EventX = new EventX(EventX.READY);
		protected _name: string;
		public get name() {
			return this._name;
		}

		protected facade: IFacade = Facade.GetInstance();
		protected _isReady: boolean = false;
		protected readyHandle: Array<(e: EventX) => void>;

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

		public addReayHandle(handle: (e: EventX) => void): boolean {
			if (this._isReady) {
				handle(AbstractMVHost.ReadyEventX);
				return true;
			}

			if (!this.readyHandle) {
				this.readyHandle = new Array<(e: EventX) => void>();
			} else {
				let index = this.readyHandle.indexOf(handle);
				if (index != -1) {
					return false;
				}
			}
			this.readyHandle.push(handle);
			return true;
		}
		public removeReayHandle(handle: (e: EventX) => void): boolean {
			if (this._isReady) {
				return false;
			}

			if (this.readyHandle) {
				let index = this.readyHandle.indexOf(handle);
				if (index != -1) {
					this.readyHandle.splice(index, 1);
					return true;
				}
			}

			return false;
		}

		protected dispatchReayHandle() {
			let e=AbstractMVHost.ReadyEventX;
			if (this.readyHandle != null) {
				this.readyHandle.forEach((val, index, list) => {
					val.apply(null, e);
				});
				//todo clear;
				this.readyHandle = null;
			}
			this.dispatchEvent(e);
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
module mvc {
	export class AbstactPanel extends foundation.EventDispatcher implements IPanel {
		protected skin: egret.DisplayObjectContainer;
		constructor() {
			super();
			this.name=Object.getPrototypeOf(this)["constructor"].name;
			this.skin = new egret.DisplayObjectContainer();
		}
		name:string;
		protected _parent: egret.DisplayObjectContainer;
		protected readyHandle: ListenerItemBox<EventX>[];

		protected _uri: string;
		protected _resizeable: boolean = false;
		protected _isReady: boolean = false;
		protected _isModel: boolean = false;
		protected _isForceModel: boolean = false;

		protected _isShow: boolean = false;
		get isShow(): boolean {
			return this._isShow;
		}
		get isReady(): boolean {
			return this._isReady;
		}
		__refMediator: IMediator=null;

		startSync(): boolean {
			if (this._isReady == false) {
				this.load();
			}
			return true;
		}

		protected load() {
			//todo;
			this._isReady = true;
			this.dispatchReayHandle();
		}


		addReayHandle(handle: ActionT<EventX>, thisObj?: any): boolean {
			if (this._isReady) {
				handle(EventX.ReadyEventX);
				return true;
			}

			if (!this.readyHandle) {
				this.readyHandle = new Array<ListenerItemBox<EventX>>();
			} else {
				for (let item of this.readyHandle) {
					if (item.handle == handle) {
						return false;
					}
				}
			}
			this.readyHandle.push(new ListenerItemBox(handle, thisObj));
			return true;
		}
		removeReayHandle(handle: ActionT<EventX>, thisObj?: any): boolean {
			if (this._isReady) {
				return false;
			}

			if (this.readyHandle) {
				let len = this.readyHandle.length;
				for (let i = 0; i < len; i++) {
					let item = this.readyHandle[i];
					if (item.handle == handle && item.thisObj == thisObj) {
						this.readyHandle.splice(i, 1);
					}
					return true;
				}
			}

			return false;
		}

		protected dispatchReayHandle() {
			let e = EventX.ReadyEventX;
			if (this.readyHandle != null) {
				this.readyHandle.forEach((val, index, list) => {
					val.handle.call(val.thisObj, e);
				});
				//todo clear;
				this.readyHandle.length = 0;
				this.readyHandle = null;
			}
			this.dispatchEvent(e);
		}


		show(container?: egret.DisplayObjectContainer) {

			if (this.isShow) {
				return;
			}

			if (container) {
				this.setParent(container);
			}


			this.doShow();
		}

		protected doShow() {

			if (this._parent == null) {
				this._parent = UILocator.UILayer;
			}
			this._isShow = true;

			this._parent.addChild(this.skin);
			this.simpleDispatch(EventX.PANEL_SHOW,this.name);
		}


		setParent(value: egret.DisplayObjectContainer) {
			this._parent = value;
		}
		hide() {
			if (!this.isShow) {
				return;
			}

			this._isShow = false;
			if (this.skin.parent != null) {
				this.skin.parent.removeChild(this.skin);
			}

			this.simpleDispatch(EventX.PANEL_HIDE,this.name);
		}

		addChild(v: egret.DisplayObject): any {
			if (v) {
				this.skin.addChild(v);
			}
		}

		bringTop() {

		}


	}
}
module mvc {
	export class AbstactPanel extends egret.DisplayObjectContainer implements IPanel {
		protected static ReadyEventX:EventX = new EventX(EventX.READY);
		public constructor() {
			super();
		}
		protected _parent: egret.DisplayObjectContainer;
		protected readyHandle:Array<(e:EventX)=>void>;

		protected _uri: string;
		protected _resizeable: boolean = false;
		protected _isReady: boolean = false;
		protected _isModel: boolean = false;
		protected _isForceModel: boolean = false;

		protected _isShow: boolean = false;
		public get isShow(): boolean {
			return this._isShow;
		}
		public get isReady(): boolean {
			return this._isReady;
		}
		public __refMediator: IMediator;

		public startSync(): boolean {
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


		public addReayHandle(handle:(e:EventX)=>void):boolean{
			 if (this._isReady)
            {
                handle(AbstactPanel.ReadyEventX);
                return true;
            }

			if(!this.readyHandle){
				this.readyHandle=new Array<(e:EventX)=>void>();
			}else{
				let index=this.readyHandle.indexOf(handle);
				if(index!=-1){
					return false;
				}
			}
			this.readyHandle.push(handle);
            return true;
		}
		public removeReayHandle(handle:(e:EventX)=>void):boolean
        {
            if (this._isReady)
            {
                return false;
            }

			if(this.readyHandle){
				let index=this.readyHandle.indexOf(handle);
				if(index!=-1){
					this.readyHandle.splice(index,1);
					return true;
				}
			}
    
            return false;
        }

		protected dispatchReayHandle(){
			let e=AbstactPanel.ReadyEventX;
			
			if (this.readyHandle != null) {
				this.readyHandle.forEach((val, index, list) => {
					val.apply(null, e);
				});
				//todo clear;
				this.readyHandle = null;
			}
			this.dispatchEvent(e);
		}


		public show(container?: egret.DisplayObjectContainer) {

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
			this._isShow=true;
			this._parent.addChild(this);
		}


		public setParent(value: egret.DisplayObjectContainer) {
			this._parent = value;
		}
		public hide() {
			if (!this.isShow) {
				return;
			}

			this._isShow=false;
			if(this.parent!=null){
				this.parent.removeChild(this);
			}
		}
		public bringTop() {

		}


	}
}
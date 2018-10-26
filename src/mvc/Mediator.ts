/// <reference path="core/AbstractMVHost.ts" />
module mvc {
	export abstract class Mediator extends AbstractMVHost implements IMediator {

		protected _view: IPanel;
		protected _model: IProxy;

		protected _hasProgress: boolean=false;
		protected _isAwake: boolean=false;

		public setView(value: IPanel) {
			if (this._view != null) {
				if (this._hasProgress) {
					this._view.removeEventListener(EventX.PROGRESS, this.viewProgressHandle, this);
				}
				this._view.__refMediator = null;
				this._view.removeEventListener(EventX.READY, this.preViewReadyHandler, this);
				this.bindSetViewEvent(this._view, false);
			}

			this._view = value;

			if (this._view != null) {
				this._view.__refMediator = this;
				let asyncView = <IAsync>this._view;
				if (asyncView.isReady == false) {
					if (this._hasProgress) {
						this._view.addEventListener(EventX.PROGRESS, this.viewProgressHandle, this);
					}
					this._view.addEventListener(EventX.READY, this.preViewReadyHandler, this);
					return;
				}
				this.preViewReadyHandler(null);
			}
		}


		protected bindSetViewEvent(view: IPanel, isBind: boolean) {
			if (isBind) {
				view.addEventListener(EventX.PANEL_SHOW, this.stageHandle, this);
				view.addEventListener(EventX.PANEL_HIDE, this.stageHandle, this);
			}
			else {
				view.removeEventListener(EventX.PANEL_SHOW, this.stageHandle, this);
				view.removeEventListener(EventX.PANEL_HIDE, this.stageHandle, this);
			}
		}

		protected stageHandle(e: EventX) {
			switch (e.type) {
				case EventX.PANEL_SHOW:
					this.facade.registerEventInterester(this, InjectEventType.Show, true);
					this.facade.registerEventInterester(this._model, InjectEventType.Show, true);

					if (this.isCanAwaken() && this.isReady && this._isAwake == false) {
						this._isAwake = true;
						if (this._model != null) {
							this.facade.registerEventInterester(this,InjectEventType.Proxy,true,this._model);
						}
						this.onPreAwaken();
					}
					break;
				case EventX.PANEL_HIDE:
					this.facade.registerEventInterester(this, InjectEventType.Show, false);
					this.facade.registerEventInterester(this._model, InjectEventType.Show, false);

					if (this.isReady && this._isAwake) {
						this._isAwake = false;
						if (this._model != null) {
							this.facade.registerEventInterester(this,InjectEventType.Proxy,false,this._model);
						}
						this.onPreSleep();
					}
					break;
			}
		}

		/// <summary>
		/// 现在状态是否可让它唤醒 
		/// </summary>
		protected isCanAwaken(): boolean {
			return true;
		}


		public getView(): IPanel {
			return this._view;
		}

		protected load() {
			if (this._view.isReady == false) {
				this._view.startSync();
			}
		}


		public setProxy(value: IProxy) {
			if (this._model == value) {
				return;
			}
			if (this._model != null) {
				if (this._hasProgress) {
					this._model.removeEventListener(EventX.PROGRESS, this.modelProgressHandle, this);
				}
				this._model.removeEventListener(EventX.READY, this.onPreModelReadyHandle, this);
				this.facade.registerEventInterester(this,InjectEventType.Proxy,false,this._model);
			}

			this._model = value;
			if (this._model != null && this.isReady && this._isAwake) {
				this.facade.registerEventInterester(this,InjectEventType.Proxy,true,this._model);
			}
		}
		public getProxy(): IProxy {
			return this._model;
		}

		public toggleSelf(type: number = -1) {
			this.facade.toggleMediatorByName(this.name, type);
		}

		protected viewProgressHandle(e: EventX) {

		}
		protected modelProgressHandle(e: EventX) {

		}

		protected preViewReadyHandler(e: EventX) {
			if (e != null) {
				let panel = e.target as IPanel;
				panel.removeEventListener(EventX.READY, this.preViewReadyHandler, this);
				if (this._hasProgress) {
					panel.removeEventListener(EventX.PROGRESS, this.viewProgressHandle, this);
				}
			}
			this.onViewReadyHandle();
			if (this._model == null) {
				this.onPreMediatorReadyHandle();
				return;
			}

			let asyncModel = this._model as IAsync;
			if (asyncModel.isReady == false) {
				if (this._hasProgress) {
					this._model.addEventListener(EventX.PROGRESS, this.modelProgressHandle, this);
				}
				this._model.addEventListener(EventX.READY, this.onPreModelReadyHandle, this);
				asyncModel.startSync();
				return;

			}
			this.onPreMediatorReadyHandle();
		}

		protected onPreModelReadyHandle(e: EventX) {
			let proxy = e.target;
			if (this._hasProgress) {
				proxy.removeEventListener(EventX.PROGRESS, this.modelProgressHandle);
			}
			proxy.removeEventListener(EventX.READY, this.onPreModelReadyHandle);
			this.onModelReadyHandle();
			this.onPreMediatorReadyHandle();
		}

		protected onViewReadyHandle() {

		}

		protected onModelReadyHandle() {

		}

		protected onPreMediatorReadyHandle() {
			this.onMediatorReadyHandle();
			//DebugX.Log("mediator:{0} ready!",this.name);
			this._isReady = true;
			
			this.dispatchReayHandle();
			this.facade.simpleDispatch(EventX.MEDIATOR_READY, this.name);

			this.bindSetViewEvent(this._view, true);
			if (this._view.isShow) {
				this.stageHandle(new EventX(EventX.PANEL_SHOW));
			}
		}

		protected onMediatorReadyHandle() {

		}

		private _isCached: boolean = false;
		protected onPreAwaken() {
			if (this._isCached == false) {
				this._isCached = true;
				this.onCache();
			}
			this.onAwaken();
			this.onUpdateView();

			this.facade.simpleDispatch(EventX.MEDIATOR_SHOW, name);
		}

		protected onAwaken() {
		}



		protected onPreSleep() {
			this.onSleep();
			this.facade.simpleDispatch(EventX.MEDIATOR_HIDE, name);
		}

		protected onSleep() {

		}

		protected onUpdateView() {
		}
		protected onCache() {
		}

	}

}
/// <reference path="core/AbstractMVHost.ts" />
module mvc {
	export abstract class Mediator extends AbstractMVHost implements IMediator {

		protected _view: IPanel;
		protected _model: IProxy;

		protected _hasProgress: boolean;
		protected _isAwake: boolean;

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
				this.bindSetViewEvent(this._view, true);
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
							this.registerProxyEvent(this._model, true);
						}
						this.preAwaken();
					}
					break;
				case EventX.PANEL_HIDE:
					this.facade.registerEventInterester(this, InjectEventType.Show, false);
					this.facade.registerEventInterester(this._model, InjectEventType.Show, false);

					if (this.isReady && this._isAwake) {
						this._isAwake = false;
						if (this._model != null) {
							this.registerProxyEvent(this._model, false);
						}
						this.preSleep();
					}
					break;


				//case PanelEvent.MOTION_HIDE_FINISHED:
				//this.viewMotionFinishedHandle(false);
				//break;
				//case PanelEvent.MOTION_SHOW_FINISHED:
				//this.viewMotionFinishedHandle(true);
				//break;
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
				this._model.removeEventListener(EventX.READY, this.preModelReadyHandle, this);
				this.registerProxyEvent(this._model, false);
			}

			this._model = value;
			if (this._model != null && this.isReady && this._isAwake) {
				this.registerProxyEvent(this._model, true);
			}
		}
		public getProxy(): IProxy {
			return this._model;
		}

		public toggleSelf(type: number = -1) {
			this.facade.toggleMediatorByName(this.name, type);
		}


		protected registerProxyEvent(_model: IProxy, isBind: boolean) {
			if (_model == null) {
				return;
			}
			let eventInterests = this.getEventInterests(InjectEventType.Proxy);
			if (isBind) {
				for (let typeEventsHandle of eventInterests) {
					for (let eventType of typeEventsHandle.events) {
						_model.addEventListener(eventType, typeEventsHandle.handle, this);
					}
				}
			}
			else {
				for (let typeEventsHandle of eventInterests) {
					for (let eventType of typeEventsHandle.events) {
						_model.removeEventListener(eventType, typeEventsHandle.handle, this);
					}
				}
			}
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
			this.viewReadyHandle();
			if (this._model == null) {
				this.preMediatorReadyHandle();
				return;
			}

			let asyncModel = this._model as IAsync;
			if (asyncModel.isReady == false) {
				if (this._hasProgress) {
					this._model.addEventListener(EventX.PROGRESS, this.modelProgressHandle, this);
				}
				this._model.addEventListener(EventX.READY, this.preModelReadyHandle, this);
				asyncModel.startSync();
				return;

			}
			this.preMediatorReadyHandle();
		}

		protected preModelReadyHandle(e: EventX) {
			let proxy = e.target;
			if (this._hasProgress) {
				proxy.removeEventListener(EventX.PROGRESS, this.modelProgressHandle);
			}
			proxy.removeEventListener(EventX.READY, this.preModelReadyHandle);
			this.modelReadyHandle();
			this.preMediatorReadyHandle();
		}

		protected viewReadyHandle() {

		}

		protected modelReadyHandle() {

		}

		protected preMediatorReadyHandle() {
			this.mediatorReadyHandle();
			//DebugX.Log("mediator:{0} ready!",this.name);
			this._isReady = true;
			
			this.dispatchReayHandle();
			this.facade.simpleDispatch(EventX.MEDIATOR_READY, this.name);

			if (this._view.isShow) {
				this.stageHandle(new EventX(EventX.ADDED_TO_STAGE));
			}
		}

		protected mediatorReadyHandle() {

		}

		private _isCached: boolean = false;
		protected preAwaken() {
			if (this._isCached == false) {
				this._isCached = true;
				this.onCache();
			}
			this.awaken();
			this.updateView();

			this.facade.simpleDispatch(EventX.MEDIATOR_SHOW, name);
		}

		protected awaken() {
		}



		protected preSleep() {
			this.sleep();
			this.facade.simpleDispatch(EventX.MEDIATOR_HIDE, name);
		}

		protected sleep() {

		}

		protected updateView() {
		}
		protected onCache() {
		}

	}

}
namespace mvc {
	export class Facade extends foundation.EventDispatcher implements IFacade {
	
		protected mvcInjectLock: { [index: string]: any } = {};
		protected commandsMap: { [index: string]: any } = {};
		protected injecter: IInject;
		protected view: IView;
		protected model: IView;
		protected static instance: IFacade;

		static GetInstance(): IFacade {
			if (Facade.instance == null) {
				Facade.instance = new Facade();
			}
			return Facade.instance;
		}

		protected constructor() {
			super();
			this.view = new View();
			this.model = new View();
			this.injecter = new MVCInject(this);
		}

		hasMediatorByName(mediatorName: string): boolean {
			return this.view.get(mediatorName) != null;
		}
		hasMediator<T extends IMediator>(c: ClassT<T>): boolean {
			let aliasName = Singleton.GetAliasName(c);
			return this.hasMediatorByName(aliasName);
		}

		getMediatorByName(mediatorName: string): IMediator {
			let mediator = <IMediator>this.view.get(mediatorName);
			if (mediator == null) {
				let cls = Singleton.GetClass(mediatorName);
				if (cls) {
					mediator = <IMediator>this.routerCreateInstance(cls);
					mediator["_name"] = mediatorName;
					this.__unSafeInjectInstance(mediator, mediatorName);
					this.registerMediator(mediator);
				} else {
					console.warn(mediatorName + " isn't registed!");
				}
			}
			return mediator;
		}
		registerMediator(mediator: IMediator) {
			this.view.register(mediator);
		}
		registerProxy(proxy: IProxy) {
			this.model.register(proxy);
		}

		registerCommand<T>(eventType: string, c: ClassT<T>): boolean {
			if (this.commandsMap[eventType]) {

				return false;
			}
			this.commandsMap[eventType] = c;
			return true;
		}
		removeCommand<T>(eventType: string, c: ClassT<T>): boolean {
			if (this.commandsMap[eventType]) {

				delete this.commandsMap[eventType]
				return true;
			}
			return false;
		}
		hasCommand(eventType: string): boolean {
			return this.commandsMap[eventType] != null;
		}


		__unSafeInjectInstance(host: IMVCHost, hostName?: string) {
			if (!hostName) {
				hostName = host.name;
			}

			this.mvcInjectLock[hostName] = host;
			//给类的成员变量赋值、注册这个类
			this.inject(host);
			this.mvcInjectLock[hostName] = null;
		}

		getInjectLock(className: string): any {
			return this.mvcInjectLock[className];
		}

		protected routerCreateInstance(type: Class): any {
			return new type();
		}

		inject(target: IInjectable): IInjectable {
			if (this.injecter != null) {
				return this.injecter.inject(target);
			}
			return target;
		}


		getMediator<T extends IMediator>(c: ClassT<T>): T {
			let aliasName =  Singleton.GetAliasName(c);
			let ins = <T>this.getMediatorByName(aliasName);
			if (!ins) {
				Singleton.RegisterClass(c, aliasName);
				ins = <T>this.getMediatorByName(aliasName);
			}

			return ins;
		}

		static GetMediator<T extends IMediator>(c: ClassT<T>): T {
			return Facade.GetInstance().getMediator(c);
		}
		static GetProxy<T extends IProxy>(c: ClassT<T>): T {
			return Facade.GetInstance().getProxy(c);
		}

		static ToggleMediator<T extends IMediator>(c: ClassT<T>): T {
			return Facade.GetInstance().toggleMediator(c);
		}


		hasProxyByName(proxyName: string): boolean {
			return this.model.get(proxyName) != null;
		}
		hasProxy<T extends IProxy>(c: ClassT<T>): boolean {
			let aliasName = Singleton.GetAliasName(c);
			return this.hasProxyByName(aliasName);
		}

		getProxyByName(proxyName: string): IProxy {
			let proxy = <IProxy>this.model.get(proxyName);
			if (proxy == null) {
				let cls = Singleton.GetClass(proxyName);
				if (cls != null) {
					proxy = <IProxy>this.routerCreateInstance(cls);
					this.__unSafeInjectInstance(proxy, proxyName);
					this.registerProxy(proxy);
				}
			}
			return proxy;
		}
		getProxy<T extends IProxy>(c: ClassT<T>): T {
			let aliasName = Singleton.GetAliasName(c);
			let ins = <T>this.getProxyByName(aliasName);
			if (!ins) {
				Singleton.RegisterClass(c, aliasName);
				ins = <T>this.getProxyByName(aliasName);
			}

			return ins;
		}

		toggleMediatorByName(mediatorName: string, type: number = -1): IMediator {
			if (!mediatorName) {
				return null;
			}

			if (type == 0) {
				if (this.hasMediatorByName(mediatorName) == false) {
					return null;
				}
			}

			let mediator = this.getMediatorByName(mediatorName);
			if (mediator == null) {
				return null;
			}


			//如果是异步的 并且isReady为false 就先执行startAsync方法，并把toggleMediator方法添加到readyHandle队列，返回mediator
			let async = <IAsync>mediator;
			if (async.isReady == false) {
				async.addReayHandle((e) => {
					this.toggleMediatorByName(mediatorName, type);
				});
				async.startSync();
				return mediator;
			}

			if (type == undefined) {
				type = -1;
			}

			//获取view，根据type决定调用show或hide
			let view = mediator.getView();
			switch (type) {
				case 1:
					if (view.isShow == false) {
						view.show();
					}
					else {
						view.bringTop();
					}
					break;
				case 0:
					if (view.isShow) {
						view.hide();
					}
					break;
				case -1:
					if (view.isShow) {
						view.hide();
					}
					else {
						view.show();
					}
					break;
			}
			return mediator;
		}

		toggleMediator<T extends IMediator>(c: ClassT<T>, type: number = -1): T {
			let aliasName = Singleton.GetAliasName(c);
			let t = <T>this.toggleMediatorByName(aliasName, type);
			if (t == null) {
				Singleton.RegisterClass(c, aliasName);
				t = <T>this.toggleMediatorByName(aliasName, type);
			}

			return t;
		}

		registerEventInterester(eventInterester: IEventInterester, injectEventType: InjectEventType, isBind: boolean = true,dispatcher:IEventDispatcher=null) {
			if (eventInterester == null) {
				return;
			}
			let eventInterests = eventInterester.getEventInterests(injectEventType);
			if (!eventInterests) {
				return;
			}

			if(dispatcher==null){
				dispatcher=this;
			}

			if (isBind) {
				for (let typeEventsHandle of eventInterests) {
					for (let eventType of typeEventsHandle.events) {
						dispatcher.addEventListener(eventType, typeEventsHandle.handle, eventInterester);
					}
				}
			}
			else {
				for (let typeEventsHandle of eventInterests) {
					for (let eventType of typeEventsHandle.events) {
						dispatcher.removeEventListener(eventType, typeEventsHandle.handle, eventInterester);
					}
				}
			}
		}
		
		autoInitialize(type: string | number) {
			
		}
		static SimpleDispatch(eventType: string, data?: any): boolean {
			return Facade.GetInstance().simpleDispatch(eventType, data);
		}
		simpleDispatch(eventType: string, data?: any): boolean {
			if (!this.hasEventListener(eventType)) {
				return false;
			}
			
			//从事件池中取一个项，用于事件发布,发布完后，再压进事件池;
			let e = EventX.FromPool(eventType, data);
			let commandClassRef = this.commandsMap[eventType];
			if (commandClassRef) {
				var command = <ICommand>new commandClassRef();
				command.execute(e);
			}

			let b = this.dispatchEvent(e);
			EventX.ToPool(e);

			return b;
		}
	}
}
const Facade = mvc.Facade;
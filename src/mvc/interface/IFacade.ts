namespace mvc {
	export interface IFacade extends INotifier,IEventDispatcher {

		/**
		 * 
		 * @param name 视图管理类
		 */
		getMediatorByName(name: string): IMediator;
		getMediator<T extends IMediator>(c: ClassT<T>): T;

		hasMediatorByName(mediatorName: string): boolean;
		hasMediator<T extends IMediator>(c: ClassT<T>): boolean

		toggleMediatorByName(mediatorName: string, type?: number): IMediator;
		toggleMediator<T extends IMediator>(c: ClassT<T>, type?: number): T;
		registerMediator(mediator: IMediator);

		/**
		 * 
		 * @param proxyName 数据管理类
		 */
		getProxyByName(proxyName: string): IProxy;
		getProxy<T extends IProxy>(c: ClassT<T>): T;

		hasProxyByName(proxyName: string): boolean;
		hasProxy<T extends IProxy>(c: ClassT<T>): boolean;
		registerProxy(proxy: IProxy);

		/**
		 * 
		 * @param eventType 注册事件
		 * @param c 事件独立处理类
		 */
		registerCommand<T>(eventType: string, c: ClassT<T>): boolean
		removeCommand<T>(eventType: string, c: ClassT<T>): boolean
		hasCommand(eventType: string): boolean;

		/**
		 * 
		 * @param eventInterester 关注事件处理类
		 * @param injectEventType 关注类型
		 * @param isBind 添加还是删除
		 */
		registerEventInterester(eventInterester: IEventInterester, injectEventType: InjectEventType, isBind?: boolean,dispatcher?:IEventDispatcher);

		/**
		 * 用于限制互相依赖的锁
		 * @param className 
		 */
		getInjectLock(className: string): any;
		__unSafeInjectInstance(toLockInstance: IMVCHost, className?: string);
		inject(target: IInjectable): IInjectable;


		/**
		 * 自动初始化
		 */
		autoInitialize(type:string|number);
	}
}
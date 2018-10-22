namespace mvc {
	export interface IFacade extends INotifier {
		
		/**
		 /**
		 * h5特有的注册类 操作(因为js代码的 初始化顺序关系,可能会有互相依赖项,不能直接由反射来操作,所以注册了关系用于直接初始化)
		 * @param mediatorClass 
		 * @param proxyClass 
		 * @param viewClass 
		 */
		//registerModule<M extends IMediator,P extends IProxy,V extends IPanel>(mediatorClass:new()=>M,proxyClass:new()=>P,viewClass:new()=>V):boolean;

		/**
		 * 
		 * @param name 视图管理类
		 */
		getMediatorByName(name:string):IMediator;
		getMediator<T extends IMediator>(c: new () => T): T;

		hasMediatorByName(mediatorName:string):boolean;
        hasMediator<T extends IMediator>(c: new () => T):boolean

		toggleMediatorByName(mediatorName:string, type?:number):IMediator;
		toggleMediator<T extends IMediator>(c: new () => T,type?:number):T;
		registerMediator(mediator:IMediator);

		/**
		 * 
		 * @param proxyName 数据管理类
		 */
		getProxyByName(proxyName:string):IProxy;
        getProxy<T extends IProxy>(c: new () => T):T;

		hasProxyByName(proxyName:string):boolean;
        hasProxy<T extends IProxy>(c: new () => T):boolean;
		registerProxy(proxy:IProxy);

		/**
		 * 
		 * @param eventType 注册事件
		 * @param c 事件独立处理类
		 */
		registerCommand<T>( eventType:string, c:new()=>T):boolean
		removeCommand<T>( eventType:string, c:new()=>T):boolean
		hasCommand(eventType:string):boolean;
		
		/**
		 * 
		 * @param eventInterester 关注事件处理类
		 * @param injectEventType 关注类型
		 * @param isBind 添加还是删除
		 */
		registerEventInterester(eventInterester:IEventInterester,injectEventType:InjectEventType, isBind?:boolean);

		getInjectLock(className:string):any;
	}
}
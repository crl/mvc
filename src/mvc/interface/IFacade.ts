namespace mvc {
	export interface IFacade extends INotifier {

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
		 * @param commandClassRef 事件独立处理类
		 */
		registerCommand<T>( eventType:string, commandClassRef:new()=>T):boolean
		removeCommand<T>( eventType:string, commandClassRef:new()=>T):boolean
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
namespace mvc {
	export interface IFacade extends INotifier {

		///mediator
		getMediatorByName(name:string):IMediator;
		getMediator<T extends IMediator>(c: new () => T): T;

		hasMediatorByName(mediatorName:string):boolean;
        hasMediator<T extends IMediator>(c: new () => T):boolean

		toggleMediatorByName(mediatorName:string, type?:number):IMediator;
		toggleMediator<T extends IMediator>(c: new () => T,type?:number):T;
		registerMediator(mediator:IMediator);

		///proxy;
		getProxyByName(proxyName:string):IProxy;
        getProxy<T extends IProxy>(c: new () => T):T;

		hasProxyByName(proxyName:string):boolean;
        hasProxy<T extends IProxy>(c: new () => T):boolean;
		registerProxy(proxy:IProxy);

		//eventInterester;
		registerEventInterester(eventInterester:IEventInterester,injectEventType:InjectEventType, isBind?:boolean);

		getInjectLock(className:string):any;
	}
}
namespace mvc {
	export class InjectEventTypeHandle {
        public constructor(public injectType: InjectEventType, public events: Array<string>, public handle: (EventX) => void) { }
    }

	export interface IEventInterester {
		__eventInteresting:{[index:string]:Array<mvc.InjectEventTypeHandle>};
		getEventInterests(type: InjectEventType): Array<InjectEventTypeHandle>;
	}

	

	export interface IView {
		get(name:string ):IMVCHost;
		register(host:IMVCHost):boolean;
		remove(host:IMVCHost):boolean;
	}


	export interface IMVCHost extends IAsync,IEventInterester,IInjectable {
		readonly name: string;
		onRegister();
		onRemove();
	}

	export interface IAsync {
		readonly isReady: boolean;

		startSync(): boolean;
		addReayHandle(handle: (e: EventX) => void): boolean;
	}

	export interface INotifier {
		simpleDispatch(type: string, data: any): boolean
	}


	export interface IInject {
		inject(target:IInjectable):IInjectable;
	}

	///是否可注入
	export interface IInjectable {

	}
}
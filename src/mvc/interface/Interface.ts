namespace mvc {
	export interface IEventInterester {
		/**
		 * @property index:InjectEventType;
		 */
		__eventInteresting: { [index: string]: Array<InjectEventTypeHandle> };
		getEventInterests(type: InjectEventType): Array<InjectEventTypeHandle>;
	}
	export interface IView {
		get(name: string): IMVCHost;
		register(host: IMVCHost): boolean;
		remove(host: IMVCHost): boolean;
	}
	export interface IMVCHost extends IAsync, IEventInterester, IInjectable {
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
	export interface ICommand {
		execute(e: EventX): void;
	}
	export interface IInject {
		inject(target: IInjectable): IInjectable;
	}
	///是否可注入
	export interface IInjectable {
		readonly __injectable: boolean;
	}
}
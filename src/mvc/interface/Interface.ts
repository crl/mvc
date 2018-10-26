namespace mvc {
	export interface IEventInterester {
		/**
		 * @property index:InjectEventType;
		 */
		__eventInteresting: { [index: string]: Array<InjectEventTypeHandle> };
		getEventInterests(InjectEventType): Array<InjectEventTypeHandle>;
	}
	export interface IView {
		get(string): IMVCHost;
		register(IMVCHost): boolean;
		remove(IMVCHost): boolean;
	}
	export interface IMVCHost extends IAsync, IEventInterester, IInjectable {
		readonly name: string;
		onRegister();
		onRemove();
	}
	export interface IAsync {
		readonly isReady: boolean;
		startSync(): boolean;
		addReayHandle(handle: Action<EventX>): boolean;
	}
	export interface INotifier {
		simpleDispatch(type: string, data: any): boolean
	}
	export interface ICommand {
		execute(EventX): void;
	}
	export interface IInject {
		inject(target: IInjectable): IInjectable;
	}
	///是否可注入
	export interface IInjectable {
		readonly __injectable: boolean;
	}
}
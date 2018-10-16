interface IStream {
	readonly code: number;
}

class ListenerItem {
	public handle: (e: IStream) => void;
	public thisObj: any;
	public constructor(handle: (e: IStream) => void, thisObj: any) {
		this.handle = handle;
		this.thisObj = thisObj;
	}
	public call(e: IStream) {
		this.handle.call(this.thisObj, e);
	}
}

class SocketX extends egret.EventDispatcher {
	protected static instance: SocketX;
	protected cmds: { [index: number]: Array<ListenerItem> } = {};

	public static GetInstance(): SocketX {
		if (SocketX.instance == null) {
			SocketX.instance = new SocketX();
		}
		return SocketX.instance;
	}

	public addListener(code: number, handler: (e: IStream) => void, thisObj: any): boolean {
		let list = this.cmds[code];
		if (!list) {
			list = new Array<ListenerItem>();
			this.cmds[code] = list;
		}

		for (let item of list) {
			if (item.handle == handler) {
				return false;
			}
		}

		let item = new ListenerItem(handler, thisObj);
		list.push(item);
		return true;
	}
	public static AddListener(code: number, handler: (e: IStream) => void, thisObj: any): boolean {
		return SocketX.GetInstance().addListener(code, handler, thisObj);
	}
	public static Dispatch(e: IStream): boolean {
		return SocketX.GetInstance().dispatch(e);
	}

	public dispatch(e: IStream): boolean {
		let list = this.cmds[e.code];
		for (let item of list) {
			item.call(e);
		}
		return true;
	}
}
interface IStream {
	readonly code: number;
}
interface IMessage {

}

interface ISocketSender extends egret.IEventDispatcher {
	send(msg: IStream):boolean;
	readonly connected: boolean;
	close():void;
}


class SocketX {
	protected static instance: SocketX;
	protected static sender: ISocketSender;
	protected static cmds: { [index: number]: Array<ListenerItemBox<IStream>> } = {};

	private static GetInstance(): SocketX {
		if (SocketX.instance == null) {
			SocketX.instance = new SocketX();
		}
		return SocketX.instance;
	}
	public static bind(sender: ISocketSender) {
		SocketX.GetInstance();
		SocketX.sender = sender;
	}

	public static Send(msg: IStream):boolean {
		return this.sender.send(msg);
	}

	public static get IsConnected() {
		return SocketX.sender.connected;
	}
	public static Close(){
		SocketX.sender.close();
	}

	public static AddEventListener(type:string, listener:(EventX)=>void,thisObj?:any,priority?:number)
	{
		SocketX.sender.addEventListener(type,listener,thisObj,false,priority);
	}
	public static RemoveEventListener(type:string, listener:(EventX)=>void,thisObj?:any)
	{
		SocketX.sender.removeEventListener(type,listener,thisObj,false);
	}

	public static AddListener(code: number, handler: ActionT<IStream>, thisObj: any): boolean {
		let list = SocketX.cmds[code];
		if (!list) {
			list = new Array<ListenerItemBox<IStream>>();
			SocketX.cmds[code] = list;
		}

		for (let item of list) {
			if (item.handle == handler) {
				return false;
			}
		}

		let item = new ListenerItemBox(handler, thisObj);
		list.push(item);
		return true;
	}
	public static Dispatch(msg: IStream): boolean {
		let list = SocketX.cmds[msg.code];
		for (let item of list) {
			item.handle.call(item.thisObj, msg);
		}
		return true;
	}
}
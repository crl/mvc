class EventX extends egret.Event {
    public static readonly PROGRESS: string = "progress";
    public static readonly READY: string = "ready";

    public static readonly MEDIATOR_READY: string = "mediatorReady";
    public static readonly MEDIATOR_SHOW: string = "mediatorShow";
    public static readonly MEDIATOR_HIDE: string = "mediatorHide";

    public data: any;
    public constructor(type: string, data: any = null) {
        super(type);
        this.data = data;
    }


    static sEventPool: Array<EventX> = new Array<EventX>();
    public static FromPool(type: string, data?: any): EventX {
        let e: EventX;
        if (EventX.sEventPool.length > 0) {
            e = EventX.sEventPool.pop();
            e.$type = type;
            e.data = data;
            return e;
        }
        else return new EventX(type, data);
    }
    public static ToPool(e: EventX) {
        if (EventX.sEventPool.length < 100) {
            e.data = null;
            EventX.sEventPool.push(e); // avoiding 'push'
        }
    }
}
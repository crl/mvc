/// <summary>
/// 简单事件类,主要附带一个数据项
/// </summary>
class EventX extends foundation.MiEventX {
    private static sEventPool: Stack<EventX> = new Stack<EventX>();
    static readonly START: string = "start";
    static readonly LOCK: string = "lock";
    static readonly UNLOCK: string = "unLock";
    static readonly READY: string = "ready";
    static ReadyEventX = new EventX(EventX.READY);
    static readonly OPEN: string = "open";
    static readonly CLOSE: string = "close";
    static readonly PAUSE: string = "pause";
    static readonly STOP: string = "stop";
    static readonly PLAY: string = "play";
    static readonly EXIT: string = "exit";
    static readonly ENTER: string = "enter";
    static readonly UPDATE: string = "update";
    static readonly ENTER_FRAME: string = "enterFrame";
    static readonly ADDED: string = "added";
    static readonly ADDED_TO_STAGE: string = "addedToStage";
    static readonly REMOVED: string = "removed";
    static readonly REMOVED_FROM_STAGE: string = "removedFromStage";
    static readonly TRIGGERED: string = "triggered";
    static readonly FLATTEN: string = "flatten";
    static readonly RESIZE: string = "resize";
    static readonly REPAINT: string = "Repaint";
    static readonly PROGRESS: string = "progress";
    static readonly CHANGE: string = "change";
    static readonly COMPLETE: string = "complete";
    static readonly CANCEL: string = "cancel";
    static readonly SUCCESS: string = "success";
    static readonly FAILED: string = "failed";
    static readonly SCROLL: string = "scroll";
    static readonly SELECT: string = "select";
    static readonly DESTOTY: string = "destory";
    static readonly DISPOSE: string = "dispose";
    static readonly DATA: string = "data";
    static readonly ERROR: string = "error";
    static readonly TIMEOUT: string = "timeout";
    static readonly CONNECTION: string = "connection";
    static readonly ITEM_CLICK: string = "itemClick";
    static readonly CLICK: string = "click";
    static readonly FOCUS_IN: string = "focus_in";
    static readonly FOCUS_OUT: string = "focus_out";
    static readonly TOUCH_BEGAN: string = "touchBegan";
    static readonly TOUCH_END: string = "touchEnd";
    static readonly TOUCH_MOVE: string = "touchMove";
    static readonly FIRE: string = "fire";
    static readonly RELOAD: string = "reload";
    static readonly RESTART: string = "restart";
    static readonly RENDER: string = "render";
    static readonly PING: string = "ping";
    static readonly RENDERABLE_CHANGE: string = "renderable_change";
    static readonly PANEL_SHOW: string = "panelShow";
    static readonly PANEL_HIDE: string = "panelHide";
    static readonly MEDIATOR_SHOW: string = "mediatorShow";
    static readonly MEDIATOR_HIDE: string = "mediatorHide";
    static readonly MEDIATOR_READY: string = "mediatorReady";
    static readonly PROXY_READY: string = "proxyReady";
    static readonly ROOT_CREATED: string = "rootCreated";
    static readonly SET_SKIN: string = "setSkin";
    static readonly STATE_CHANGE: string = "stateChange";
    static CLEAR_CACHE: string = "clearCache";
    static DEPEND_READY: string = "dependReady";
    static CLEAR: string = "clear";
    private mCurrentTarget: IEventDispatcher;
    private mBubbles: boolean;
    private mStopsPropagation: boolean;
    private mStopsImmediatePropagation: boolean;
    public constructor(type: string, data: any = null, bubbles: boolean = false) {
        super(type, data);
        this.mBubbles = bubbles;
    }
    $stopPropagation() {
        this.mStopsPropagation = true;
    }
    $stopImmediatePropagation() {
        this.mStopsPropagation = this.mStopsImmediatePropagation = true;
    }
    public get bubbles(): boolean {
        return this.mBubbles;
    }
    public get currentTarget(): IEventDispatcher {
        return this.mCurrentTarget;
    }
    $setCurrentTarget(value: IEventDispatcher) {
        this.mCurrentTarget = value;
    }
    $setData(value: any) { this.$mData = value; }
    get $stopsPropagation(): boolean {
        return this.mStopsPropagation;
    }
    get $stopsImmediatePropagation(): boolean {
        return this.mStopsImmediatePropagation;
    }
    static FromPool(type: string, data: any = null, bubbles: boolean = false): EventX {
        let e: EventX;
        if (EventX.sEventPool.Count > 0) {
            e = EventX.sEventPool.Pop();
            e.$reset(type, bubbles, data);
            return e;
        }
        else return new EventX(type, data, bubbles);
    }
    static ToPool(e: EventX) {
        if (EventX.sEventPool.Count < 100) {
            e.$mData = e.$mTarget = e.mCurrentTarget = null;
            EventX.sEventPool.Push(e); // avoiding 'push'
        }
    }
    $reset(type: string, bubbles: boolean = false, data: any = null): EventX {
        this.$mType = type;
        this.mBubbles = bubbles;
        this.$mData = data;
        this.$mTarget = this.mCurrentTarget = null;
        this.mStopsPropagation = this.mStopsImmediatePropagation = false;
        return this;
    }
    public clone(): EventX {
        return new EventX(this.type, this.data, this.bubbles);
    }
}

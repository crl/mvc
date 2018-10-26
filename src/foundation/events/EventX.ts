    /// <summary>
    /// 简单事件类,主要附带一个数据项
    /// </summary>
    class EventX extends foundation.MiEventX
    {
        private static sEventPool:Stack<EventX> = new Stack<EventX>();

        public static readonly START :string= "start";

        public static readonly LOCK :string= "lock";
        public static readonly UNLOCK :string= "unLock";

        public static readonly READY :string= "ready";

        public static readonly OPEN :string= "open";
        public static readonly CLOSE :string= "close";
        public static readonly PAUSE :string= "pause";
        public static readonly STOP :string= "stop";
        public static readonly PLAY :string= "play";

        public static readonly EXIT :string= "exit";
        public static readonly ENTER :string= "enter";
      
        public static readonly UPDATE :string= "update";
        public static readonly ENTER_FRAME :string= "enterFrame";

        public static readonly ADDED :string= "added";
        public static readonly ADDED_TO_STAGE :string= "addedToStage";

        public static readonly REMOVED :string= "removed";
        public static readonly REMOVED_FROM_STAGE :string= "removedFromStage";

        public static readonly TRIGGERED :string= "triggered";

        public static readonly FLATTEN :string= "flatten";
        public static readonly RESIZE :string= "resize";

        public static readonly REPAINT :string= "Repaint";

        public static readonly PROGRESS :string= "progress";
        public static readonly CHANGE :string= "change";
        public static readonly COMPLETE :string= "complete";
        public static readonly CANCEL :string= "cancel";

        public static readonly SUCCESS :string= "success";
        public static readonly FAILED :string= "failed";
      
        public static readonly SCROLL :string= "scroll";
        public static readonly SELECT :string= "select";

        public static readonly DESTOTY :string= "destory";
        public static readonly DISPOSE :string= "dispose";
        public static readonly DATA :string= "data";

        public static readonly ERROR :string= "error";

        public static readonly TIMEOUT :string= "timeout";

        public static readonly CONNECTION :string= "connection";
       
        public static readonly ITEM_CLICK :string= "itemClick";
        public static readonly CLICK :string= "click";

        public static readonly FOCUS_IN :string= "focus_in";
        public static readonly FOCUS_OUT :string= "focus_out";

        public static readonly TOUCH_BEGAN :string= "touchBegan";
        public static readonly TOUCH_END :string= "touchEnd";
        public static readonly TOUCH_MOVE :string= "touchMove";

        public static readonly FIRE :string= "fire";
        public static readonly RELOAD :string= "reload";
        public static readonly RESTART :string= "restart";

        public static readonly RENDER :string= "render";
        public static readonly PING :string= "ping";

        public static readonly RENDERABLE_CHANGE :string= "renderable_change";

        public static readonly MEDIATOR_SHOW :string= "mediatorShow";
        public static readonly MEDIATOR_HIDE :string= "mediatorHide";
        public static readonly MEDIATOR_READY :string= "mediatorReady";
        public static readonly PROXY_READY :string= "proxyReady";

        public static readonly ROOT_CREATED :string= "rootCreated";
        public static readonly SET_SKIN :string= "setSkin";
        public static readonly STATE_CHANGE :string= "stateChange";
        public static CLEAR_CACHE :string= "clearCache";
        public static DEPEND_READY :string= "dependReady";
        public static CLEAR :string= "clear";

        private mCurrentTarget:IEventDispatcher;

        private mBubbles:boolean;
        private mStopsPropagation:boolean;
        private mStopsImmediatePropagation:boolean;
       

        public constructor(type:string, data:any=null, bubbles:boolean = false)
        {
            super(type,data);
            this.mBubbles = bubbles;
        }

        stopPropagation()
        {
            this.mStopsPropagation = true;
        }

        stopImmediatePropagation()
        {
            this.mStopsPropagation = this.mStopsImmediatePropagation = true;
        }

        public get bubbles():boolean
        {
                return this.mBubbles;
        }

        public get currentTarget():IEventDispatcher
        {
                return this.mCurrentTarget;
        }

        $setCurrentTarget(value:IEventDispatcher)
        {
            this.mCurrentTarget = value;
        }

        $setData(value:any) { this.$mData = value; }

         get $stopsPropagation():boolean
        {
                return this.mStopsPropagation;
        }

        get $stopsImmediatePropagation():boolean
        {
                return this.mStopsImmediatePropagation;
        }

      

        static FromPool(type:string, data:any = null, bubbles:boolean = false):EventX
        {
            let e:EventX;
            if (EventX.sEventPool.Count > 0)
            {
                e = EventX.sEventPool.Pop();
                e.$reset(type, bubbles, data);
                return e;
            }
            else return new EventX(type, data, bubbles);
        }

        static ToPool(e:EventX)
        {
            if (EventX.sEventPool.Count < 100)
            {
                e.$mData = e.$mTarget = e.mCurrentTarget = null;
                EventX.sEventPool.Push(e); // avoiding 'push'
            }
        }

        $reset(type:string, bubbles:boolean = false, data:any = null):EventX
        {
            this.$mType = type;
            this.mBubbles = bubbles;
            this.$mData = data;
            this.$mTarget = this.mCurrentTarget = null;
            this.mStopsPropagation = this.mStopsImmediatePropagation = false;
            return this;
        }

        public clone():EventX
        {
            return new EventX(this.type, this.data, this.bubbles);
        }

    }

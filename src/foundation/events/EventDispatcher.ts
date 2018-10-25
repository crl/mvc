namespace foundation
{
    export class EventDispatcher implements IEventDispatcher,IDisposable
    {
         mEventListeners:Dictionary<string, Signal> = null;
         mTarget:IEventDispatcher;


        /** Creates an EventDispatcher. */
        public constructor(target:IEventDispatcher = null)
        {
            if (target == null)
            {
                target = this;
            }
            this.mTarget = target;
        }

        public addEventListener(type: string, listener: Action<EventX>, thisObj?: any, priority?: number): boolean
        {
            if (listener == null)
            {
                return false;
            }

            if (this.mEventListeners == null)
            {
                this.mEventListeners = new Dictionary<string, Signal>();
            }
            let signal=this.mEventListeners.TryGetValue(type);
            if (signal==null)
            {
                signal = new Signal();
                this.mEventListeners.Add(type, signal);
            }

            return signal.add(listener, priority);
        }

        public dispatchEvent(e: EventX):boolean
        {
            if (e == null)
            {
                return false;
            }
            let bubbles = e.bubbles;

            if (!bubbles && (this.mEventListeners == null || this.mEventListeners.ContainsKey(e.type) == false)) {
                return false;
            }
 
            let previousTarget:IEventDispatcher = e.target;
            e.setTarget(mTarget);

            let b = this.invokeEvent(e);

            if (previousTarget != null) e.setTarget(previousTarget);

            return b;
        }

        protected void innerDirectDispatchEvent(e:EventX)
        {
            dispatchEvent(e);
        }

        internal invokeEvent(e:EventX):boolean
        {
            if (this.mEventListeners == null)
            {
                return false;
            }

            let signal=this.mEventListeners.TryGetValue(e.type);
            if (signal==null)
            {
                return false;
            }

            let t = signal.firstNode;
            if (t == null) {
                return false;
            }

            let temp = SimpleListPool.Get<Action<EventX>>();

            let i = 0;
            while (t != null) {
                temp.push(t.action);
                t = t.next;
                i++;
            }

            e.setCurrentTarget(mTarget);

            let listener:Action<EventX>;
            for (let j = 0; j < i; j++) {

                listener = temp[j];

                listener(e);

                if (e.stopsImmediatePropagation) {

                    return true;
                }
            }

            SimpleListPool.Release(temp);

            return e.stopsPropagation;
        }

        public hasEventListener(type: string):boolean
        {
            if (this.mEventListeners == null)
            {
                return false;
            }

            let signal=this.mEventListeners.TryGetValue(type);
            if (signal)
            {
                return signal != null && signal.firstNode != null;
            }
            return false;
        }

        public removeEventListener(type: string, listener: Action<EventX>, thisObj?: any): boolean
        {

            if (this.mEventListeners != null)
            {
                let signal=this.mEventListeners.TryGetValue(type);
                if (signal==null)
                {
                    return false;
                }
                signal.remove(listener);
            }
            return true;
        }

        public removeEventListeners(type:string= null)
		{
            if (type != null && this.mEventListeners != null) {
                this.mEventListeners.Remove(type);
            } else {
                this.mEventListeners = null;
            }
		}

        public dispose()
        {
            this._clear();
        }

        public simpleDispatch(type:string, data:any = null):boolean
        {
            if (this.hasEventListener(type) == false)
            {
                return false;
            }
            let e = EventX.FromPool(type, data, false);
            let b = dispatchEvent(e);
            EventX.ToPool(e);
            return b;
        }


        _clear()
        {
            if (this.mEventListeners == null)
            {
                return;
            }

            for(let signal of this.mEventListeners.Values)
            {
                signal._clear();
            }

            this.mEventListeners = null;
        }
    }
}

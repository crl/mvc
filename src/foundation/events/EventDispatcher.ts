namespace foundation {
    export class EventDispatcher implements IEventDispatcher, IDisposable {
        private mEventListeners: Dictionary<string, Signal> = null;
        private mTarget: IEventDispatcher;

        /** Creates an EventDispatcher. */
        constructor(target: IEventDispatcher = null) {
            if (target == null) {
                target = this;
            }
            this.mTarget = target;
        }

        addEventListener(type: string, listener: ActionT<EventX>, thisObj?: any, priority?: number): boolean {
            if (listener == null) {
                return false;
            }

            if (this.mEventListeners == null) {
                this.mEventListeners = new Dictionary<string, Signal>();
            }
            let signal = this.mEventListeners.Get(type);
            if (signal == null) {
                signal = new Signal();
                this.mEventListeners.Add(type, signal);
            }

            return signal.add(listener, thisObj, priority);
        }

        dispatchEvent(e: EventX): boolean {
            if (e == null) {
                return false;
            }
            let bubbles = e.bubbles;

            if (!bubbles && (this.mEventListeners == null || this.mEventListeners.ContainsKey(e.type) == false)) {
                return false;
            }

            let previousTarget: IEventDispatcher = e.target;
            e.$setTarget(this.mTarget);

            let b = this.$invokeEvent(e);

            if (previousTarget != null) e.$setTarget(previousTarget);

            return b;
        }
        $invokeEvent(e: EventX): boolean {
            if (this.mEventListeners == null) {
                return false;
            }

            let signal = this.mEventListeners.Get(e.type);
            if (signal == null) {
                return false;
            }

            let t = signal.$firstNode;
            if (t == null) {
                return false;
            }

            let temp = SimpleListPool.Get<SignalNode<EventX>>();

            let i = 0;
            while (t != null) {
                temp.Push(t);
                t = t.next;
                i++;
            }

            e.$setCurrentTarget(this.mTarget);
            let listener: ActionT<EventX>;
            for (let j = 0; j < i; j++) {

                t = temp[j];

                t.action.call(t.thisObj, e);

                if (e.$stopsImmediatePropagation) {

                    return true;
                }
            }
            SimpleListPool.Release(temp);
            return e.$stopsPropagation;
        }

        hasEventListener(type: string): boolean {
            if (this.mEventListeners == null) {
                return false;
            }

            let signal = this.mEventListeners.Get(type);
            if (signal) {
                return signal != null && signal.$firstNode != null;
            }
            return false;
        }

        removeEventListener(type: string, listener: ActionT<EventX>, thisObj?: any): boolean {
            if (this.mEventListeners != null) {
                let signal = this.mEventListeners.Get(type);
                if (signal == null) {
                    return false;
                }
                signal.remove(listener, thisObj);
            }
            return true;
        }

        removeEventListeners(type: string = null) {
            if (type != null && this.mEventListeners != null) {
                this.mEventListeners.Remove(type);
            } else {
                this.mEventListeners = null;
            }
        }

        dispose() {
            this.$clear();
        }

        simpleDispatch(type: string, data: any = null): boolean {
            if (this.hasEventListener(type) == false) {
                return false;
            }
            let e = EventX.FromPool(type, data, false);
            let b = this.dispatchEvent(e);
            EventX.ToPool(e);
            return b;
        }


        $clear() {
            if (this.mEventListeners == null) {
                return;
            }

            for (let signal of this.mEventListeners.Values) {
                signal.$clear();
            }

            this.mEventListeners = null;
        }
    }
}

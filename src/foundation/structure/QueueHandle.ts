
namespace foundation {
    export class QueueHandle<T>
    {
        private static NodePool: List<SignalNode<any>> = new Array<SignalNode<any>>();
        private static MAX: number = 1000;
        private static SignalNodeListPool: List<List<SignalNode<any>>> = new Array<List<SignalNode<any>>>();
        protected static GetSignalNodeList(): List<SignalNode<any>> {
            if (QueueHandle.SignalNodeListPool.length > 0) {
                let temp = QueueHandle.SignalNodeListPool.pop();
                temp.length = 0;
                return temp;
            }
            return new Array<SignalNode<any>>();
        }
        protected static Recycle(node: List<SignalNode<any>>) {
            if (QueueHandle.SignalNodeListPool.length < 300) {
                QueueHandle.SignalNodeListPool.push(node);
            }
        }

        firstNode: SignalNode<T>;
        lastNode: SignalNode<T>;
        protected maping: Dictionary<Action<T>, SignalNode<T>>;
        protected len: number = 0;
        __dispatching: boolean = false;
        public get length(): number {
            return this.len;
        }

        public dispatch(e: T) {
            if (this.len > 0) {
                this.__dispatching = true;
                let t = this.firstNode;
                let temp = QueueHandle.GetSignalNodeList();
                while (t != null) {
                    if (t.__active == NodeActiveState.Runing) {
                        t.action(e);
                    }
                    temp.push(t);
                    t = t.next;
                }
                this.__dispatching = false;
                let l = temp.length;
                for (let i = 0; i < l; i++) {
                    let item = temp[i];

                    if (item.__active == NodeActiveState.ToDoDelete) {
                        this._remove(item, item.action);
                    }
                    else if (item.__active == NodeActiveState.ToDoAdd) {
                        item.__active = NodeActiveState.Runing;
                    }
                }
                QueueHandle.Recycle(temp);
            }
        }
        public ___addHandle(value: Action<T>, data: T, forceData: boolean = false): boolean {
            if (this.maping == null) {
                this.maping = new Dictionary<Action<T>, SignalNode<T>>();
            }
            let t: SignalNode<T> = null;
            if (t = this.maping.TryGetValue(value)) {
                if (t.__active == NodeActiveState.ToDoDelete) {
                    if (this.__dispatching) {
                        t.__active = NodeActiveState.ToDoAdd;
                    }
                    else {
                        t.__active = NodeActiveState.Runing;
                    }
                    t.data = data;
                    return true;
                }
                if (forceData) {
                    t.data = data;
                }
                return false;
            }

            t = this.getSignalNode();
            t.action = value;
            t.data = data;
            this.maping.Add(value, t);

            if (this.__dispatching) {
                t.__active = NodeActiveState.ToDoAdd;
            }

            if (this.lastNode != null) {
                this.lastNode.next = t;
                t.pre = this.lastNode;
                this.lastNode = t;
            }
            else {
                this.firstNode = this.lastNode = t;
            }

            this.len++;

            return true;
        }

        protected getSignalNode(): SignalNode<T> {
            let t: SignalNode<T>;
            if (QueueHandle.NodePool.length > 0) {
                t = QueueHandle.NodePool.pop();
                t.__active = NodeActiveState.Runing;
            }
            else {
                t = new SignalNode<T>();
            }
            return t;
        }


        public ___removeHandle(value: Action<T>): boolean {
            if (this.lastNode == null || this.maping == null) {
                return false;
            }

            let t: SignalNode<T> = this.maping.TryGetValue(value);
            if (t == null || t.__active == NodeActiveState.ToDoDelete) {
                return false;
            }

            if (this.__dispatching) {
                t.__active = NodeActiveState.ToDoDelete;
                return true;
            }

            return this._remove(t, value);
        }

        public hasHandle(value: Action<T>): boolean {
            if (this.maping == null) {
                return false;
            }
            return this.maping.Get(value) != null;
        }

        protected _remove(t: SignalNode<T>, value: Action<T>): boolean {
            if (t == null) {
                DebugX.LogError("queueHandle error nil");
            }
            let pre = t.pre;
            let next = t.next;
            if (pre != null) {
                pre.next = next;
            } else {
                this.firstNode = next;
            }

            if (next != null) {
                next.pre = pre;
            } else {
                this.lastNode = pre;
            }
            t.__active = NodeActiveState.ToDoDelete;

            this.maping.Remove(value);

            if (QueueHandle.NodePool.length < QueueHandle.MAX) {
                t.action = null;
                t.pre = t.next = null;
                QueueHandle.NodePool.push(t);
            }
            this.len--;

            if (this.len < 0) {
                DebugX.LogError("QueueHandle lenError:" + this.len);
            }

            return true;
        }


        public _clear() {
            if (null == this.firstNode) {
                return;
            }
            let t = this.firstNode;
            let n: SignalNode<T>;
            while (t != null) {
                t.action = null;
                if (QueueHandle.NodePool.length > QueueHandle.MAX) {
                    break;
                }
                n = t.next;

                t.action = null;
                t.pre = t.next = null;
                QueueHandle.NodePool.push(t);

                t = n;
            }
            this.maping = null;
            this.firstNode = this.lastNode = null;
            this.len = 0;
        }

    }
}

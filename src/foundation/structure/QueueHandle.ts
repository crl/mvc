
namespace foundation {
    export class QueueHandle<T>
    { 
        private static MAX: number = 1000;
        private static NodePool: List<SignalNode<any>> = new List<SignalNode<any>>();
        private static SignalNodeListPool: List<List<SignalNode<any>>> = new List<List<SignalNode<any>>>();
        protected static GetSignalNodeList<T>(): List<SignalNode<T>> {
            if (QueueHandle.SignalNodeListPool.Count > 0) {
                let temp = QueueHandle.SignalNodeListPool.Pop();
                temp.Clear();
                return temp;
            }
            return new List<SignalNode<T>>();
        }
        protected static GetSignalNode<T>(): SignalNode<T> {
            let t: SignalNode<T>;
            if (QueueHandle.NodePool.Count > 0) {
                t = QueueHandle.NodePool.Pop();
                t.$active = NodeActiveState.Runing;
            }
            else {
                t = new SignalNode<T>();
            }
            return t;
        }
        protected static Recycle<T>(node: List<SignalNode<T>>) {
            if (QueueHandle.SignalNodeListPool.Count < 300) {
                QueueHandle.SignalNodeListPool.Push(node);
            }
        }

        firstNode: SignalNode<T>;
        lastNode: SignalNode<T>;
        protected maping: TwoKeyDictionary<ActionT<T>, any, SignalNode<T>>;
        protected len: number = 0;
        $dispatching: boolean = false;
        public get length(): number {
            return this.len;
        }

        public dispatch(e: T) {
            if (this.len > 0) {
                this.$dispatching = true;
                let t = this.firstNode;
                let temp:List<SignalNode<T>> = QueueHandle.GetSignalNodeList<T>();
                while (t != null) {
                    if (t.$active == NodeActiveState.Runing) {
                        t.action(e);
                    }
                    temp.Push(t);
                    t = t.next;
                }
                this.$dispatching = false;
                let l = temp.Count;
                for (let i = 0; i < l; i++) {
                    let item = temp[i];

                    if (item.$active == NodeActiveState.ToDoDelete) {
                        this.$remove(item, item.action,item.thisObj);
                    }
                    else if (item.$active == NodeActiveState.ToDoAdd) {
                        item.$active = NodeActiveState.Runing;
                    }
                }
                QueueHandle.Recycle(temp);
            }
        }
        public $addHandle(value: ActionT<T>, thisObj: any, data: T, forceData: boolean = false): boolean {
            if (this.maping == null) {
                this.maping = new TwoKeyDictionary<ActionT<T>, any, SignalNode<T>>();
            }
            let t: SignalNode<T> =  this.maping.Get(value, thisObj);
            if (t!=null) {
                if (t.$active == NodeActiveState.ToDoDelete) {
                    if (this.$dispatching) {
                        t.$active = NodeActiveState.ToDoAdd;
                    }
                    else {
                        t.$active = NodeActiveState.Runing;
                    }
                    t.data = data;
                    return true;
                }
                if (forceData) {
                    t.data = data;
                }
                return false;
            }

            t = QueueHandle.GetSignalNode();
            t.action = value;
            t.thisObj=thisObj;
            t.data = data;
            this.maping.Add(value, thisObj, t);

            if (this.$dispatching) {
                t.$active = NodeActiveState.ToDoAdd;
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


        public $removeHandle(value: ActionT<T>, thisObj: any): boolean {
            if (this.lastNode == null || this.maping == null) {
                return false;
            }

            let t: SignalNode<T> = this.maping.Get(value, thisObj);
            if (t == null || t.$active == NodeActiveState.ToDoDelete) {
                return false;
            }

            if (this.$dispatching) {
                t.$active = NodeActiveState.ToDoDelete;
                return true;
            }

            return this.$remove(t, value, thisObj);
        }

        public hasHandle(value: ActionT<T>, thisObj: any): boolean {
            if (this.maping == null) {
                return false;
            }
            return this.maping.Get(value, thisObj) != null;
        }

        protected $remove(t: SignalNode<T>, value: ActionT<T>, thisObj: any): boolean {
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
            t.$active = NodeActiveState.ToDoDelete;

            this.maping.Remove(value, thisObj);

            if (QueueHandle.NodePool.Count < QueueHandle.MAX) {
                t.action = null;
                t.pre = t.next = null;
                QueueHandle.NodePool.Push(t);
            }
            this.len--;

            if (this.len < 0) {
                DebugX.LogError("QueueHandle lenError:" + this.len);
            }

            return true;
        }


        $clear() {
            if (null == this.firstNode) {
                return;
            }
            let t = this.firstNode;
            let n: SignalNode<T>;
            while (t != null) {
                t.action = null;
                if (QueueHandle.NodePool.Count > QueueHandle.MAX) {
                    break;
                }
                n = t.next;

                t.action = null;
                t.pre = t.next = null;
                QueueHandle.NodePool.Push(t);

                t = n;
            }
            this.maping = null;
            this.firstNode = this.lastNode = null;
            this.len = 0;
        }

    }
}

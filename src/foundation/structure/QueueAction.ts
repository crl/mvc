namespace foundation {
    export class QueueAction<T>
    {
        private static MAX: number = 1000;
        private static NodePool: Stack<ActionNode<any>> = new Stack<ActionNode<any>>();
        private static SignalNodeListPool: Stack<List<ActionNode<any>>> = new Stack<List<ActionNode<any>>>();
        protected static GetSignalNodeList<T>(): List<ActionNode<T>> {
            if (QueueAction.SignalNodeListPool.Count > 0) {
                let temp = QueueAction.SignalNodeListPool.Pop();
                temp.Clear();
                return temp;
            }

            return new List<ActionNode<T>>();
        }
        protected static GetSignalNode<T>(): ActionNode<T> {
            let t: ActionNode<T>;
            if (QueueAction.NodePool.Count > 0) {
                t = QueueAction.NodePool.Pop();
                t.$active = NodeActiveState.Runing;
            }
            else {
                t = new ActionNode<T>();
            }
            return t;
        }

        protected static Recycle<T>(node: List<ActionNode<T>>) {
            if (QueueAction.SignalNodeListPool.Count < 300) {
                QueueAction.SignalNodeListPool.Push(node);
            }
        }

        $firstNode: ActionNode<T>;
        $lastNode: ActionNode<T>;
        protected maping: TwoKeyDictionary<Action, any, ActionNode<T>>;
        protected len: number = 0;
        $dispatching: boolean = false;

        public get length() {
            return this.len;
        }

        dispatch() {
            if (this.len > 0) {
                this.$dispatching = true;
                let t = this.$firstNode;

                let temp = QueueAction.GetSignalNodeList<T>();

                while (t != null) {
                    if (t.$active == NodeActiveState.Runing) {
                        t.action();
                    }
                    temp.Push(t);
                    t = t.next;
                }
                this.$dispatching = false;

                let l = temp.Count;
                for (let i = 0; i < l; i++) {
                    let item = temp.Get(i);
                    if (item.$active == NodeActiveState.ToDoDelete) {
                        this.$remove(item, item.action, item.thisObj);
                    }
                    else if (item.$active == NodeActiveState.ToDoAdd) {
                        item.$active = NodeActiveState.Runing;
                    }
                }
                QueueAction.Recycle(temp);
            }
        }



        public $addHandle(value: Action, thisObj: any, data: T, forceData: boolean = false): boolean {
            if (this.maping == null) {
                this.maping = new TwoKeyDictionary<Action, any, ActionNode<T>>();
            }
            let t = this.maping.Get(value, thisObj);
            if (t) {
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

                //DebugX.Log(this.GetType().FullName + ":addReplace" + data.ToString());
                return false;
            }

            //DebugX.Log(this.GetType().FullName+":add"+data.ToString());

            t = QueueAction.GetSignalNode();
            t.thisObj=thisObj;
            t.action = value;
            t.data = data;
            this.maping.Add(value, thisObj, t);

            if (this.$dispatching) {
                t.$active = NodeActiveState.ToDoAdd;
            }

            if (this.$lastNode != null) {
                this.$lastNode.next = t;
                t.pre = this.$lastNode;
                this.$lastNode = t;
            }
            else {
                this.$firstNode = this.$lastNode = t;
            }

            this.len++;

            return true;
        }


        public $removeHandle(value: Action, thisObj: any): boolean {
            if (this.$lastNode == null || this.maping == null) {
                return false;
            }

            let t = this.maping.Get(value, thisObj);
            if (!t || t.$active == NodeActiveState.ToDoDelete) {
                return false;
            }

            if (this.$dispatching) {
                t.$active = NodeActiveState.ToDoDelete;
                return true;
            }

            return this.$remove(t, value, thisObj);
        }

        public hasHandle(value: Action, thisObj: any): boolean {
            if (this.maping == null) {
                return false;
            }

            return this.maping.ContainsKey(value, thisObj);
        }

        protected $remove(t: ActionNode<T>, value: Action, thisObj: any): boolean {
            if (t == null) {
                DebugX.LogError("queueAction error nil");
            }

            let pre = t.pre;
            let next = t.next;
            if (pre != null) {
                pre.next = next;
            }
            else {
                this.$firstNode = next;
            }

            if (next != null) {
                next.pre = pre;
            }
            else {
                this.$lastNode = pre;
            }
            t.$active = NodeActiveState.ToDoDelete;

            this.maping.Remove(value, thisObj);

            if (QueueAction.NodePool.Count < QueueAction.MAX) {
                t.action = null;
                t.pre = t.next = null;
                QueueAction.NodePool.Push(t);
            }
            this.len--;


            if (this.len < 0) {
                DebugX.LogError("QueueAction lenError:" + this.len);
            }

            return true;
        }


        public $clear() {
            if (null == this.$firstNode) {
                return;
            }

            let t = this.$firstNode;
            let n: ActionNode<T>;
            while (t != null) {
                if (QueueAction.NodePool.Count > QueueAction.MAX) {
                    break;
                }
                n = t.next;

                t.action = null;
                t.pre = t.next = null;
                QueueAction.NodePool.Push(t);

                t = n;
            }

            this.maping = null;
            this.$firstNode = this.$lastNode = null;
            this.len = 0;
        }

    }
}

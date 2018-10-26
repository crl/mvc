namespace foundation {
    export class Signal extends QueueHandle<EventX>
    {
        public add(value: ActionT<EventX>, thisObj: any, priority: number = 0): boolean {
            if (this.maping == null) {
                this.maping = new TwoKeyDictionary<ActionT<EventX>, any, SignalNode<EventX>>();
            }

            let t: SignalNode<EventX> = this.maping.Get(value, thisObj);
            if (t) {
                //如果已被删除过程中又被添加(好神奇的逻辑,但必然会有这种情况，不是可能);
                if (t.$active == NodeActiveState.ToDoDelete) {
                    if (this.$dispatching) {
                        t.$active = NodeActiveState.ToDoAdd;
                    }
                    else {
                        t.$active = NodeActiveState.Runing;
                    }
                    return true;
                }
                return false;
            }

            let newNode = Signal.GetSignalNode<EventX>();

            newNode.action = value;
            newNode.thisObj=thisObj;
            newNode.priority = priority;

            this.maping.Add(value, thisObj, newNode);

            if (this.$dispatching) {
                newNode.$active = NodeActiveState.ToDoAdd;
            }

            if (this.$firstNode == null) {
                this.len = 1;
                this.$lastNode = this.$firstNode = newNode;
                return true;
            }

            let findNode: SignalNode<EventX> = null;
            if (priority > this.$lastNode.priority) {
                t = this.$firstNode;
                let pre: SignalNode<EventX>;
                //var next:SignalNode;
                while (null != t) {
                    if (priority > t.priority) {
                        pre = t.pre;
                        //next=t.next;
                        newNode.next = t;
                        t.pre = newNode;

                        if (null != pre) {
                            pre.next = newNode;
                            newNode.pre = pre;
                        }
                        else {
                            this.$firstNode = newNode;
                        }

                        findNode = t;

                        break;
                    }
                    t = t.next;
                }
            }

            if (null == findNode) {
                this.$lastNode.next = newNode;
                newNode.pre = this.$lastNode;
                this.$lastNode = newNode;
            }
            this.len++;
            return true;
        }


        public remove(value: ActionT<EventX>, thisObj: any): boolean {
            return this.$removeHandle(value, thisObj);
        }
    }
}

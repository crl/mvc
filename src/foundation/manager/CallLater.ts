namespace foundation {
    /// <summary>
    /// 不受时间暂停控制
    /// </summary>
    export class CallLater extends QueueAction<number>
    {
        private static Instance: CallLater = new CallLater();
        private static ActionMap: Dictionary<string, IAnyAction> = new Dictionary<string, IAnyAction>();
        /// <summary>
        /// 添加延迟调用函数
        /// </summary>
        /// <param name="handler">延迟调用函数</param>
        /// <param name="deleTime">延迟秒数</param>
        /// <param name="key">替换掉key相同 已有的handler</param>
        public static Add(handler: Action, thisObj?: any, delayTime: number = -1, key: string = "") {
            if (delayTime < 16) {
                delayTime = 16;
            }

            if (key) {
                let oldAnyAction = CallLater.ActionMap.Get(key);
                if (oldAnyAction) {
                    CallLater.Remove(oldAnyAction.action);
                    CallLater.ActionMap[key] = handler;
                }
                else {
                    CallLater.ActionMap.Add(key, <IAnyAction>{ thisObj: thisObj, action: handler });
                }
            }

            CallLater.Instance.add(delayTime, handler, thisObj);
        }

        /// <summary>
        /// 如果存在就先删除,强制在延迟时间后;
        /// </summary>
        /// <param name="handler"></param>
        /// <param name="deleTime"></param>
        /// <param name="key"></param>
        static ForceAdd(handler: Action, thisObj?: any, deleTime: number = 16, key: string = "") {
            if (CallLater.Has(handler)) {
                CallLater.Remove(handler, key);
            }
            CallLater.Add(handler, thisObj, deleTime, key);
        }

        static Has(handler: Action, thisObj?: any): boolean {
            return CallLater.Instance.hasHandle(handler, thisObj);
        }

        static Remove(handler: Action, thisObj?: any, key: string = "") {
            CallLater.Instance.$removeHandle(handler, thisObj);
            if (key) {
                CallLater.ActionMap.Remove(key);
            }
        }
        static RemoveByKey(key: string) {
            if (key) {
                let oldAnyAction = CallLater.ActionMap.Get(key);
                if (oldAnyAction) {
                    CallLater.Remove(oldAnyAction.action, oldAnyAction.thisObj, key);
                }
            }
        }
        private add(delayTime: number, handler: Action, thisObj: any) {
            this.$addHandle(handler, thisObj, TickManager.GetNow() + delayTime, true);
            if (this.len > 0) {
                TickManager.Add(this.render, this);
            } else if (this.$firstNode != null) {
                TickManager.Add(this.render, this);
                DebugX.LogError("callLater 有bug:" + this.len);
            }
        }
        private render(deltaTime: number) {
            if (this.len > 0) {
                this.$dispatching = true;
                let t = this.$firstNode;
                let temp = QueueAction.GetSignalNodeList<number>();
                let now = TickManager.GetNow();
                while (t != null) {
                    if (t.$active == NodeActiveState.Runing) {
                        if (now > t.data) {
                            CallLater.Remove(t.action, t.thisObj);
                            t.action.call(t.thisObj);
                            //DebugX.Log("callLater:" + now + ":" + t.data);
                        }

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
                CallLater.Recycle(temp);
            }
            else {
                TickManager.Remove(this.render, this);
            }
        }
    }
}

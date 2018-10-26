namespace foundation {
    export const enum DeltaTimeType {
        DELTA_TIME,
        FIXED_DELTA_TIME,
        UNSCALED_DELTA_TIME
    }

    export class TimerUtil extends QueueHandle<number>
    {
        private pre: number = 0;
        private delayTime: number = 500;
        public static GetDeltaTime(dtType: DeltaTimeType): number {
            switch (dtType) {
                case DeltaTimeType.DELTA_TIME:
                    return 16;
                case DeltaTimeType.FIXED_DELTA_TIME:
                    return 16;
                case DeltaTimeType.UNSCALED_DELTA_TIME:
                    return 16;
            }
            return 16;
        }
        private constructor(delayTime: number = 500) {
            super();
            this.delayTime = delayTime;
        }

        private add(handler: ActionT<number>, thisObj?: any, delayTime: number = -1) {
            if (delayTime > 0) {
                delayTime = TickManager.GetNow() + delayTime;
            }
            this.$addHandle(handler, thisObj, delayTime, true);
            if (this.len == 1) {
                TickManager.Add(this.render);
            }
        }

        private static time30: TimerUtil;
        /// <summary>
        /// 添加重复调用频率函数
        /// </summary>
        /// <param name="handler"></param>
        /// <param name="delayTime">倒计时时间,会带在handler中,代表剩余时间</param>
        public static Add30(handler: ActionT<number>, thisObj?: any, delayTime: number = -1) {
            if (TimerUtil.time30 == null) {
                TimerUtil.time30 = new TimerUtil(300);
            }
            TimerUtil.time30.add(handler, thisObj, delayTime);
        }
        private static time100: TimerUtil;
        /// <summary>
        /// 添加重复调用频率函数
        /// </summary>
        /// <param name="handler"></param>
        /// <param name="delayTime">倒计时时间,会带在handler中,代表剩余时间</param>
        public static Add100(handler: ActionT<number>, thisObj?: any, delayTime: number = -1) {
            if (TimerUtil.time100 == null) {
                TimerUtil.time100 = new TimerUtil(100);
            }
            TimerUtil.time100.add(handler, thisObj, delayTime);
        }

        public static Remove(handler: ActionT<number>, thisObj?: any) {
            if (TimerUtil.time30 != null) {
                if (TimerUtil.time30.$removeHandle(handler, thisObj)) {
                    return;
                }
            }
            if (TimerUtil.time100 != null) {
                if (TimerUtil.time100.$removeHandle(handler, thisObj)) {
                    return;
                }
            }
            if (TimerUtil.time300 != null) {
                if (TimerUtil.time300.$removeHandle(handler, thisObj)) {
                    return;
                }
            }
            if (TimerUtil.time500 != null) {
                if (TimerUtil.time500.$removeHandle(handler, thisObj)) {
                    return;
                }
            }
            if (TimerUtil.time700 != null) {
                if (TimerUtil.time700.$removeHandle(handler, thisObj)) {
                    return;
                }
            }
            if (TimerUtil.time1000 != null) {
                if (TimerUtil.time1000.$removeHandle(handler, thisObj)) {
                    return;
                }
            }
        }

        private static time300: TimerUtil;
        /// <summary>
        /// 添加重复调用频率函数
        /// </summary>
        /// <param name="handler"></param>
        /// <param name="delayTime">倒计时时间,会带在handler中,代表剩余时间</param>
        public static Add300(handler: ActionT<number>, thisObj?: any, delayTime: number = -1) {
            if (TimerUtil.time300 == null) {
                TimerUtil.time300 = new TimerUtil(300);
            }
            TimerUtil.time300.add(handler, thisObj, delayTime);
        }

        private static time500: TimerUtil;
        /// <summary>
        /// 添加重复调用频率函数
        /// </summary>
        /// <param name="handler"></param>
        /// <param name="delayTime">倒计时时间,会带在handler中,代表剩余时间</param>
        public static Add500(handler: ActionT<number>, thisObj?: any, delayTime: number = -1) {
            if (TimerUtil.time500 == null) {
                TimerUtil.time500 = new TimerUtil(500);
            }

            TimerUtil.time500.add(handler, thisObj, delayTime);
        }
        private static time700: TimerUtil;
        /// <summary>
        /// 添加重复调用频率函数
        /// </summary>
        /// <param name="handler"></param>
        /// <param name="delayTime">倒计时时间,会带在handler中,代表剩余时间</param>
        public static Add700(handler: ActionT<number>, thisObj?: any, delayTime: number = -1) {
            if (TimerUtil.time700 == null) {
                TimerUtil.time700 = new TimerUtil(700);
            }
            TimerUtil.time700.add(handler, thisObj, delayTime);
        }
        private static time1000: TimerUtil;
        /// <summary>
        /// 添加重复调用频率函数
        /// </summary>
        /// <param name="handler"></param>
        /// <param name="delayTime">倒计时时间,会带在handler中,代表剩余时间</param>
        static Add1000(handler: ActionT<number>, thisObj?: any, delayTime: number = -1) {
            if (TimerUtil.time1000 == null) {
                TimerUtil.time1000 = new TimerUtil(1000);
            }
            TimerUtil.time1000.add(handler, thisObj, delayTime);
        }

        render(deltaTime: number) {
            if (this.len < 1) {
                TickManager.Remove(this.render,this);
                return;
            }
            let now = TickManager.GetNow();
            let dis = now - this.pre;
            if (dis < this.delayTime - 16) {
                return;
            }
            this.pre = now;

            this.$dispatching = true;
            let t = this.$firstNode;
            let temp = QueueHandle.GetSignalNodeList<number>();
            while (t != null) {
                if (t.$active == NodeActiveState.Runing) {
                    let delta = this.delayTime;
                    if (t.data != -1) {
                        delta = t.data - this.pre;
                        if (delta < 0) {
                            this.$removeHandle(t.action, t.thisObj);
                        }
                    }
                    t.action(delta);
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
            QueueHandle.Recycle(temp);
        }
    }
}
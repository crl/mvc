namespace foundation {
    export class StateMachineEventX {
        public static readonly CHANGE: string = "StateMachineEventX_CHANGE";
    }

    /// <summary>
    ///  状态机
    ///  抽像不同事物的状态,让它在一定时间内只处于一个状态
    ///  如：场景
    /// </summary>
    export class StateMachine extends foundation.EventDispatcher {
        protected states: Dictionary<string, IState>;
        protected _currentState: IState;
        public updateLimit: number = 0;
        private preTime: number = 0;

        /// <summary>
        /// 状态机;
        /// </summary>
        /// <param name="target">状态机控制的对像;</param>
        constructor() {
            super();
            this.states = new Dictionary<string, IState>();
        }

        /// <summary>
        /// 添加不同的状态; 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public addState(value: IState): boolean {
            if (this.states.ContainsKey(value.type)) {
                return false;
            }
            value.stateMachine = this;
            this.states.Add(value.type, value);
            //states[value.type] = value;
            return true;
        }

        /// <summary>
        ///  删除状态; 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public removeState(value: IState): boolean {
            if (this.hasState(value.type) == false) {
                return false;
            }
            value.stateMachine = null;
            this.states.Remove(value.type);
            return true;
        }

        /// <summary>
        /// 是否存在状态; 
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public hasState(type: string): boolean {
            return this.states.ContainsKey(type);
        }

        /// <summary>
        /// 取得状态 
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>		
        public getState(type: string): IState {
            if (!type) {
                return null;
            }

            let state = this.states.Get(type);
            if (state) {
                return state;
            }
            return null;
        }

        /// <summary>
        /// 设置当前状态 
        /// </summary>
        public get currentState(): string {
            if (this._currentState == null) {
                return "";
            }
            return this._currentState.type;
        }
        public set currentState(value: string) {
            let newState = this.getState(value);

            if (newState == this._currentState) {
                DebugX.Log("currentState not change:" + this._currentState);
                return;
            }

            if (this._currentState != null) {
                this._currentState.removeEventListener(EventX.EXIT, this.exitHandle, this);
                this._currentState.sleep();
                this._currentState = null;
            }

            this._currentState = newState;

            if (this._currentState != null) {

                let type = this._currentState.type;
                if (this._currentState.initialized == false) {
                    this._currentState.initialize();
                }

                this._currentState.addEventListener(EventX.EXIT, this.exitHandle, this);
                this._currentState.awaken();
            }
            else if (!value) {
                DebugX.Log("未注册SceneState:" + value);
            }

            this.simpleDispatch(StateMachineEventX.CHANGE);
        }



        protected Update() {
            let now = TickManager.GetNow();
            if (now - this.preTime < this.updateLimit) {
                return;
            }
            this.preTime = now;

            if (this._currentState != null) {
                this._currentState.update();
            }
        }

        private exitHandle(e: EventX) {
            let target = e.target as IState;
            target.removeEventListener(EventX.EXIT, this.exitHandle, this);

            if (target != this._currentState) {
                return;
            }

            this._currentState = null;
            if (target.nextState) {
                this.currentState = target.nextState;
            }
            else {
                this.currentState = null;
            }
        }
    }
}

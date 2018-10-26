namespace foundation {
    export abstract class AbstractState extends EventDispatcher implements IState {
        public static IsDebug: boolean = false;
        protected _type: string;

        protected _nextState: string;

        /// <summary>
        /// 是否已完成初始化;
        /// </summary>
        private _initialized: boolean = false;

        private _stateMachine: StateMachine;
        public get stateMachine(): StateMachine {
            return this._stateMachine;
        }
        /// <summary>
        /// 当前状态名称;
        /// </summary>
        /// <param name="type"></param>

        /// <summary>
        /// 是否初始化完成 
        /// </summary>

        public get initialized(): boolean {
            return this._initialized;
        }

        /// <summary>
        /// 初始化
        /// </summary>

        initialize() {
            this._initialized = true;
        }

        update() {

        }

        /// <summary>
        /// 当前状态名称; 
        /// </summary>
        public get type(): string {
            return this._type;
        }

        get nextState(): string {
            return this._nextState;
        }
        set nextState(value: string) {
            this._nextState = value;
        }

        sleep() {
            if (AbstractState.IsDebug) {
                DebugX.Log("sleep:" + this.type);
            }
            this.simpleDispatch(EventX.EXIT);
        }

        /// <summary>
        /// 进入当前状态; 
        /// </summary>
        awaken() {
            if (AbstractState.IsDebug) {
                DebugX.Log("awaken:" + this.type);
            }
        }
    }
}

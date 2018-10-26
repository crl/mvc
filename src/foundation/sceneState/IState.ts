namespace foundation {
    /// <summary>
    ///  状态接口(指单个状态)
    /// </summary>
    export interface IState extends IEventDispatcher {
        /// <summary>
        /// 是否初始化完成 
        /// </summary>
        readonly initialized: boolean;

        stateMachine: StateMachine;
        readonly nextState: string;

        /// <summary>
        /// 只做一次调用; 
        /// </summary>
        initialize();

        /// <summary>
        /// 状态标识; 
        /// </summary>

        readonly type: string

        update();

        /// <summary>
        /// 退出当前状态时; 
        /// </summary>

        sleep();

        /// <summary>
        /// 进入当前状态; 
        /// </summary>

        awaken();
    }
}

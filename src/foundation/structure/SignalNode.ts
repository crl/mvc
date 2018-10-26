namespace foundation {
    export const enum NodeActiveState {
        ///正在运行;
        Runing,
        /// 将加入; 
        ToDoAdd,
        /// 将删除;
        ToDoDelete
    }
    export class SignalNode<T>
    {
        next: SignalNode<T>;
        pre: SignalNode<T>;
        action: ActionT<T>;

        thisObj:any;
        data: T;
        /// <summary>
        /// 0:将删除;
        /// 1:正在运行
        /// 2:将加入; 
        /// </summary>
        $active: NodeActiveState= NodeActiveState.Runing;;
        priority: number = 0;
    }


}

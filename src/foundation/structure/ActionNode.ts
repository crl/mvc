namespace foundation {
    export class ActionNode<T>
    {
        next: ActionNode<T>;
        pre: ActionNode<T>;
        action: Action;
        thisObj:any;
        data: T;
        /// <summary>
        /// 0:将删除;
        /// 1:正在运行
        /// 2:将加入; 
        /// </summary>
        $active: NodeActiveState = NodeActiveState.Runing;
        priority: number = 0;

    }
}
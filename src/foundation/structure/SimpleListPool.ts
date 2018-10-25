namespace foundation {
    /// <summary>
    /// 列表池 临时列表
    /// </summary>
    /// <typeparam name="T"></typeparam>
    export class SimpleListPool
    {
        private static Pools: List<List<any>> = new Array<List<any>>();
        public static Get<T>(): List<T> {
            if (SimpleListPool.Pools.length > 0) {
                return SimpleListPool.Pools.pop();
            }
            return new Array<T>();
        }

        public static Release<T>(value: List<T>) {
            if (SimpleListPool.Pools.length < 100) {
                value.length = 0;
                SimpleListPool.Pools.push(value);
            }
        }
    }
}
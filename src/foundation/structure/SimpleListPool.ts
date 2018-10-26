namespace foundation {
    /// <summary>
    /// 列表池 临时列表
    /// </summary>
    /// <typeparam name="T"></typeparam>
    export class SimpleListPool
    {
        private static Pools: List<List<any>> = new List<List<any>>();
        public static Get<T>(): List<T> {
            if (SimpleListPool.Pools.Count > 0) {
                return SimpleListPool.Pools.Pop();
            }
            return new List<T>();
        }

        public static Release<T>(value: List<T>) {
            if (SimpleListPool.Pools.Count < 100) {
                value.Clear();
                SimpleListPool.Pools.Push(value);
            }
        }
    }
}
namespace foundation {
    export class TickManager {
        private static now: number = 0;
        private static deltaTime: number = 0;
        static GetNow(): number {
            return TickManager.now;
        }
        private static updateQueue: QueueHandle<number> = new QueueHandle<number>();
        static Add(action: ActionT<number>, thisObj?: any): boolean {
            return TickManager.updateQueue.$addHandle(action, thisObj, 0);
        }
        static Remove(action: ActionT<number>, thisObj?: any): boolean {
            return TickManager.updateQueue.$removeHandle(action, thisObj);
        }

        static Tick(now: number) {
            let deltaTime = now - TickManager.now;
            if (TickManager.now == 0) {
                deltaTime = 16;
            }

            TickManager.now = now;
            TickManager.deltaTime = deltaTime;
            TickManager.updateQueue.dispatch(deltaTime);
        }
    }
}
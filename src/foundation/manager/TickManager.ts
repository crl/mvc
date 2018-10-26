namespace foundation {
    export class TickManager {
        static GetNow(): number {
            return 0;
        }
        private static updateQueue: QueueHandle<number>;
        static Add(action: ActionT<number>, thisObj?: any): boolean {
            return TickManager.updateQueue.$addHandle(action, thisObj, 0);
        }
        static Remove(action: ActionT<number>, thisObj?: any): boolean {
            return TickManager.updateQueue.$removeHandle(action, thisObj);
        }

        static Tick(deltaTime: number) {
            TickManager.updateQueue.dispatch(deltaTime);
        }
    }
}
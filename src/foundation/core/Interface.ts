    interface IDisposable {
        dispose();
    }
    interface IEventDispatcher {
        addEventListener(type: string, listener: Action<EventX>, thisObj?: any, priority?: number): boolean;
        hasEventListener(type: string):boolean;
        removeEventListener(type: string, listener: Action<EventX>, thisObj?: any): boolean;
        dispatchEvent(e: EventX):boolean;

    }



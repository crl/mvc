type Class = new () => any;
type ClassT<T> = new () => T;
type ActionT<T> = (T) => void;
type Action = () => void;
type Handle<T, R> = (T) => R;
interface IAnyAction {
    thisObj: any,action: Action;
}

interface IAnyActionT<T> {
    thisObj: any,action: ActionT<T>;
}
interface IDisposable {
    dispose();
}
interface IEventDispatcher {
    addEventListener(type: string, listener: ActionT<EventX>, thisObj?: any, priority?: number): boolean;
    hasEventListener(type: string): boolean;
    removeEventListener(type: string, listener: ActionT<EventX>, thisObj?: any): boolean;
    dispatchEvent(e: EventX): boolean;
}



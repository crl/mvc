class ListenerItemBox<T>{
    constructor(public handle: Action<T>,public thisObj:any){}
}
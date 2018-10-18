class ListenerItemBox<T>{
    constructor(public handle: (e: T) => void,public thisObj:any){}
}
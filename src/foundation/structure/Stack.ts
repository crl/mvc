class Stack<T>{
    private list:Array<T>=new Array<T>();
    Push(e: T): any {
        this.list.push(e);
    }
    Pop(): T {
        return this.list.pop();
    }
    get Count(): number{
        return this.list.length;
    }

    Clear() {
        this.list.length=0;
    }
}

class List<T> extends Stack<T>{
    
}
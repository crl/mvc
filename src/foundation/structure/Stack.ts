class Stack<T>{
    private len=0;
    Push(e: T): any {
        this[this.len++] = e;
    }
    Pop(): T {
        if (this.len > 0) {
            this.len--;
            let t=this[this.len];
            this[this.len]=null;
            delete this[this.len];
            return t;
        }
        return null;
    }
    Get(i:number):T{
      return <T>this[i];
    }
    get Count(): number {
        return this.len;
    }

    Clear() {
        for (let index = 0; index < this.len; index++) {
            this[index]=null;
            delete this[index];
        }
        this.len=0;
    }
}

class List<T> extends Stack<T>{
}
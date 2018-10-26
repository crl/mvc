type Class=new()=>any;
type ClassT<T>=new()=>T;
type Action<T>=(T)=>void;
type Handle<T,R>=(T)=>R;

/**
 * Dictionary其实就是含有两个对位关系数组的而已
 * 接口尽量符合C#,因为我要靠一些类过来方便
 */
class Dictionary<K, V>{
    protected keys: Array<K> = new Array<K>();
    protected values: Array<V> = new Array<V>();

    
    public get Values(): Array<V>{
        return this.values;
    }
    Add(key: K, value: V) {
        let i = this.keys.indexOf(key);
        if (i == -1) {
            this.keys.push(key);
            this.values.push(value);
        }else{
            this.values[i]=value;
        }
    }
    ContainsKey(key:K):boolean{
        return this.keys.indexOf(key)!=-1;
    }
    ContainsValue(value:V):boolean{
        return this.values.indexOf(value)!=-1;
    }
    get(key:string){

    }

    Remove(key: K): boolean {
        let i = this.keys.indexOf(key);
        if (i != -1) {
            this.keys.splice(i, 1);
            this.values.splice(i, 1);
            return true;
        }
        return false;
    }
    Get(key: K): V{
        let i = this.keys.indexOf(key);
        if (i == -1) {
            return null;
        }
        return this.values[i];
    }
    TryGetValue(key: K): V {
        return this.Get(key);
    }
}
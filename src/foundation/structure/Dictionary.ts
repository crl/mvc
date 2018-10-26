type Class = new () => any;
type ClassT<T> = new () => T;
type ActionT<T> = (T) => void;

type Action=()=>void;
type Handle<T, R> = (T) => R;

interface IAnyAction{
    thisObj:any;
    action:Action;
}

interface IAnyActionT<T>{
    thisObj:any;
    action:ActionT<T>;
}

/**
 * Dictionary其实就是含有两个对位关系数组的而已
 * 接口尽量符合C#,因为我要靠一些类过来方便
 */
class Dictionary<K, V>{
    protected keys: Array<K> = new Array<K>();
    protected values: Array<V> = new Array<V>();
    public get Values(): Array<V> {
        return this.values;
    }
    Add(key: K, value: V) {
        let i = this.keys.indexOf(key);
        if (i == -1) {
            this.keys.push(key);
            this.values.push(value);
        } else {
            this.values[i] = value;
        }
    }
    ContainsKey(key: K): boolean {
        return this.keys.indexOf(key) != -1;
    }
    ContainsValue(value: V): boolean {
        return this.values.indexOf(value) != -1;
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
    Get(key: K): V {

        let i = this.keys.indexOf(key);
        if (i == -1) {
            return null;
        }
        return this.values[i];
    }

    get Count(): number {
        return this.keys.length;
    }
}


/**
 * 两个对像组合当Key的情况,应该仅仅只有js里面的函数会丢失this所以才需要的吧
 * 所以没有必要 更多Key的组合
 */
class TwoKeyDictionary<K, K1, V>{
    protected keys: Array<K> = new Array<K>();
    protected key1s: Array<K1> = new Array<K1>();
    protected values: Array<V> = new Array<V>();

    Add(key: K, key1: K1, value: V) {
        let i = this.keys.indexOf(key);

        if (i == -1 || this.key1s[i]!=key1) {
            this.keys.push(key);
            this.key1s.push(key1);
            this.values.push(value);
            return;
        }
        this.values[i] = value;
    }
    ContainsKey(key: K, key1: K1): boolean {
        let i = this.keys.indexOf(key);
        if (i == -1) {
            return false;
        }
        return this.key1s[i] != key1;
    }
    ContainsValue(value: V): boolean {
        return this.values.indexOf(value) != -1;
    }

    Remove(key: K, key1: K1): boolean {
        let i = this.keys.indexOf(key);
        if (i == -1) {
            return false;
        }
        if (this.key1s[i] != key1) {
            return false;
        }

        this.keys.splice(i, 1);
        this.key1s.splice(i, 1);
        this.values.splice(i, 1);
        return true;
    }
    Get(key: K, key1: K1): V {

        let i = this.keys.indexOf(key);
        if (i == -1) {
            return null;
        }

        if (this.key1s[i] != key1) {
            return null;
        }

        return this.values[i];
    }

    GetIndex(i: number): { k: K, k1: K1, v: V } {
        return { k: this.keys[i], k1: this.key1s[i], v: this.values[i] };
    }

    get Count(): number {
        return this.keys.length;
    }
}
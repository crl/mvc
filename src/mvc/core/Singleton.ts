namespace mvc {
    export class Singleton {
        /**
         * 单例辅助
         */
        private static uniqueClassMap: { [index: string]: new () => any } = {};
        private static uniqueInstanceMap: { [index: string]: any } = {};

        /**
         * 类名或都别名找到类
         */
        private static __classMap: { [index: string]: new () => any } = {};

        /**
         * 别名关系表
         */
        private static __aliasMap: { [index: string]: string } = {};


        /**
         * 取得一个别名，或者短名称 (eg: com.lingyu.BagView 得到已注册的别名 或者生成一个规则下的短名:BagView )
         * @param fullClassName 完整的类名
         */
        static GetAliasName(fullClassName: string | { new(): any }): string {
            if (fullClassName) {
                let str: string;
                if (typeof fullClassName == "string") {
                    str = fullClassName;
                } else {
                    str = Singleton.GetClassFullName(fullClassName);
                }

                let aliasName = Singleton.__aliasMap[str];
                if (aliasName) {
                    return aliasName;
                }
                return str.split(".").pop();
            }
            return null;
        }

       /**
        * 完整的类路径
        * @param c 类
        */
        static GetClassFullName(c: new () => any): string {
            //todo 先从注册列表中取;
            return egret.getQualifiedClassName(c);
        }

        /**
        * 注册单例类的别名
        * @param c 要注册的类
        * @param aliasName 取一个别名
        * @param fullClassName 实际的完整类名(因为js默认编译是不包含包的名称空间或者模块,完整名称有利于区别不同的模块下面的同名类)
        */
        public static RegisterUnique<T>(c: new () => T, aliasName?: string, fullClassName?: string) {
            if (!fullClassName) {
                fullClassName = Singleton.GetClassFullName(c);
            }
            if (!aliasName) {
                aliasName = Singleton.GetAliasName(fullClassName);
            }

            Singleton.__aliasMap[fullClassName] = aliasName;
            Singleton.__classMap[fullClassName] = c;

            Singleton.uniqueClassMap[fullClassName] = c;
            if (aliasName != fullClassName) {
                Singleton.__classMap[aliasName] = c;
                Singleton.uniqueClassMap[aliasName] = c;
            }
        }


        /**
         * 注册类的别名(批量)
         * @param arg 
         */
        public static RegisterMulitClass(...arg: Array<new () => any>) {
            for (const iterator of arg) {
                if (iterator) Singleton.RegisterClass(iterator);
            }
        }

        /**
         * 注册类的别名
         * @param c 要注册的类
         * @param aliasName 取一个别名
         * @param fullClassName 实际的完整类名(因为js默认编译是不包含包的名称空间或者模块,完整名称有利于区别不同的模块下面的同名类)
         */
        public static RegisterClass<T>(c: new () => T, aliasName?: string, fullClassName?: string) {
            if (!fullClassName) {
                fullClassName = Singleton.GetClassFullName(c);
            }
            if (!aliasName) {
                aliasName = Singleton.GetAliasName(fullClassName);
            }
            Singleton.__aliasMap[fullClassName] = aliasName;
            Singleton.__classMap[fullClassName] = c;

            if (aliasName != fullClassName) {
                Singleton.__classMap[aliasName] = c;
            }
        }

        /**
         * 是否定义为单例类(可以是还未创建的单例,只有有标记过单例:RegisterUnique)
         * @param aliasName 别名/完整类名
         */
        public static IsUnique(aliasName: string): boolean {
            if (!aliasName) {
                return false;
            }
            if (Singleton.uniqueInstanceMap[aliasName]) {
                return true;
            }

            return Singleton.uniqueClassMap[aliasName] != null;
        }

        /**
         * 取出一个实例(如果不存在 创建一个)
         * @param aliasName 类别名/完整类名
         */
        public static __GetOrCreateOneInstance(aliasName: string): any {
            if (!aliasName) {
                console.warn("aliasName is empty:", aliasName);
                return null;
            }
            let target = Singleton.uniqueInstanceMap[aliasName];
            if (target) {
                return target;
            }

            let c = Singleton.uniqueClassMap[aliasName]
            if (c) {
                let ins = new c();

                Singleton.uniqueInstanceMap[aliasName] = ins;

                ///是否存在重复定义的名字
                let realName = c["name"];
                let t;
                if (t = Singleton.uniqueInstanceMap[realName]) {
                    console.warn(realName + " uniqueInstanceMap has:" + t)
                } else {
                    Singleton.uniqueInstanceMap[realName] = ins;
                }

                return ins;
            }

            c = Singleton.GetClass(aliasName);

            if (c == null) {
                return null;
            }

            return new c();
        }

        /**
         * 取得一个单例
         * @param aliasName 别名/完整类名
         */
        public static GetInstance(aliasName: string): any {
            let target = Singleton.uniqueInstanceMap[aliasName];
            if (target) {
                return target;
            }

            let ins = Singleton.__GetOrCreateOneInstance(aliasName);
            if (ins) {
                Singleton.uniqueInstanceMap[aliasName] = ins;
            }
            return ins;
        }

        /**
         * 用别名 取得一个类型
         * @param aliasName 别名/完整类名
         */
        public static GetClass(aliasName: string): new () => any {
            if (!aliasName) {
                console.error("aliasName is empty:" + aliasName);
                return null;
            }

            let cls = Singleton.__classMap[aliasName];
            if (cls == null) {
                cls = egret.getDefinitionByName(aliasName);
            }
            return cls;
        }
    }
}
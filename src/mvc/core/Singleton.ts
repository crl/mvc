namespace mvc {
	export class Singleton {
		private static uniqueMap:{[index:string]:any} = {};
		private static uniqueInstanceMap:{[index:string]:any} = {};

		private static __classMap: { [index: string]: any } = {};
		private static __aliasMap: { [index: string]: string } = {};


		public static RegisterClass<T>(c: new () => T, aliasName?: string) {
			let fullClassName =egret.getQualifiedClassName(c);
			if (!aliasName) {
				aliasName = fullClassName.split(".").pop();
			}
			Singleton.__aliasMap[fullClassName] = aliasName;
			
			Singleton.__classMap[fullClassName]=c;
			Singleton.__classMap[aliasName] = c;
		}

		public static IsUnique(aliasName:string):boolean{
			if(!aliasName){
				return false;
			}

			let ins=Singleton.uniqueInstanceMap[aliasName];
			if(ins){
				return true;
			}

			return Singleton.uniqueMap[aliasName]!=null;
		}

		public static __GetOneInstance(aliasName:string):any
        {
            if (!aliasName)
            {
                return null;
            }
			let target = Singleton.uniqueInstanceMap[aliasName];
            if (target)
            {
                return target;
            }

            let c=Singleton.uniqueMap[aliasName]
			if (c)
            {
                let ins = new c();
                Singleton.uniqueInstanceMap[aliasName] = ins;
                Singleton.uniqueInstanceMap[c.FullName] = ins;
                return ins;
            }

            c = Singleton.GetClass(aliasName);

            if (c == null)
            {
                return null;
            }

            return new c();
        }

		public static GetInstance(aliasName:string):any
        {
            if (!aliasName)
            {
                console.warn("aliasName is empty:",aliasName);
                return null;
            }

            let ins=Singleton.uniqueInstanceMap[aliasName];
			if(!ins){
                let c=Singleton.uniqueMap[aliasName];
				if (c)
                {
                    c = Singleton.GetClass(aliasName);
                }

                if (c == null)
                {
                    return null;
                }
				ins = new c();
                Singleton.uniqueInstanceMap[aliasName] = ins;
            }
            return ins;
        }

		public static GetClass(aliasName: string): any {
			if (!aliasName) {
				console.error("aliasName is empty:" + aliasName);
				return null;
			}

			let cls= Singleton.__classMap[aliasName];
            if(cls==null){
                cls=egret.getDefinitionByName(aliasName);
            }
            return cls;
		}
	}
}
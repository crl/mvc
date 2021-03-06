module mvc {
	/**
	 * 注入管理类
	 */
    export class MVCInject implements IInject {
        public static readonly INJECTABLE: string = "__injectable";
        private static InjectDefMapping: { [index: string]: { [index: string]: string } } = {};
        private static InjectShortNameMapping: { [index: string]: string } = {};
		/**
		 * @param o 导出的mvc注入数据
		 */
        public static InitMVCInjectDef(o: { [index: string]: string[] }) {
            for (const fullClassName in o) {
                let li = o[fullClassName];
                let map = MVCInject.InjectDefMapping[fullClassName];
                if (map == null) {
                    map = {};
                    MVCInject.InjectDefMapping[fullClassName] = map;
                    let aliasName =Singleton.GetAliasName(fullClassName);
                    if (aliasName != fullClassName) {
                        MVCInject.InjectShortNameMapping[aliasName] = fullClassName;
                    }
                }

                for (const iterator of li) {
                    let t = iterator.split(":");
                    map[t[0]] = t[1];
                }
            }
        }
        public constructor(private facade: IFacade) {}
        private getInjectClassByDef(classInjectData: InjectClassData, property: string): Class {
            let fullClassName = classInjectData.getFullClassName();
            let dic = MVCInject.InjectDefMapping[fullClassName];
            if (!dic) {
                fullClassName = MVCInject.InjectShortNameMapping[fullClassName];
                dic = MVCInject.InjectDefMapping[fullClassName];
            }
            if (!dic) {
                return null;
            }
            let def = dic[property];
            let cls = Singleton.GetClass(def);
            if (cls == null) {
                let nsList = fullClassName.split(".");
                let len = nsList.length;
				/**
				 * 从后往前加名称空间(eg:game,lingyu.game,com.lingyu.game)
				 */
                for (let i = len - 2; i > -1; i--) {
                    def = nsList[i] + "." + def;
                    cls = Singleton.GetClass(def);
                    if (cls) {
                        break;
                    }
                }
            }
            return cls;
        }
        public inject(target: IInjectable): IInjectable {
            let type = Object.getPrototypeOf(target);
            while (type) {
                let item=InjectAttribute.Get(type);
                if(item)this.doInject(item, target);
                
                //循环找基类注入
                type = Object.getPrototypeOf(type);
            }
            return target;
        }
        protected doInject(classInjectData: InjectClassData, target: IInjectable) {
            for (let key in classInjectData.propertys) {
                let cls = this.getInjectClassByDef(classInjectData, key);
                if (cls == null) {
                    DebugX.LogError(target, key, "注入的类型找不到:" + classInjectData.getFullClassName());
                    continue;
                }
                let o = this.autoMVC(cls);
                if (!o) {
                    continue;
                }
                target[key] = o;
                if (key == "view" && ("setView" in target)) {
                    (<IMediator>target).setView(o);
                } else if (key == "proxy" && ("setProxy" in target)) {
                    (<IMediator>target).setProxy(o);
                }
            }
            for (let cmd in classInjectData.cmds) {
                let list = classInjectData.cmds[cmd];
                for (let item of list) {
                    SocketX.AddListener(+cmd, item, target);
                }
            }
        }
        protected autoMVC(classType:Class): any {
            let fullClassName = Singleton.GetClassFullName(classType);
            if (Singleton.IsUnique(fullClassName)) {
                return Singleton.GetInstance(fullClassName);
            }
            let aliasName = Singleton.GetAliasName(fullClassName);
            let isProxy = ReflectUtils.IsSubclassOf(classType, Proxy);
            let isMediator:boolean;
            if(isProxy){
                if(this.facade.hasProxyByName(aliasName)) {
                    return this.facade.getProxyByName(aliasName);
                }
            }else if(isMediator=ReflectUtils.IsSubclassOf(classType, Mediator)){
                if(this.facade.hasMediatorByName(aliasName)) {
                    return this.facade.getMediatorByName(aliasName);
                }
            }else{
                let ins = new classType();
                if (ins[MVCInject.INJECTABLE]) {
                    ins = this.inject(ins);
                }
                return ins;
            }
            let ins = this.facade.getInjectLock(aliasName);
            if (!ins) {
                ins = Singleton.__GetOrCreateOneInstance(aliasName);
                ins["_name"] = aliasName;
                //可注入 必须加锁 (先调用也是想让onRegister的时候 可以访问注入对像)
                if (ins[MVCInject.INJECTABLE]) {
                    this.facade.__unSafeInjectInstance(ins);
                }

                if (isMediator) {
                    this.facade.registerMediator(<IMediator>ins);
                }
                else if (isProxy) {
                    this.facade.registerProxy(<IProxy>ins);
                }
            }
            return ins;
        }
    }
}
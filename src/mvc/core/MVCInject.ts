module mvc {
    //不导出
    class ClassInjectData {

        public propertys: { [index: string]: any } = {};
        //typeEvents
        public typeEventHandles: { [index: string]: Array<InjectEventTypeHandle> } = {};
        //指令
        public cmds: { [index: number]: Array<(e: IStream) => void> } = {};
        public constructor(public classPrototype: Function) {
        }
        /**
         * 取得完整类名
         */
        getFullClassName(): any {
            return this.classPrototype["constructor"]["name"];
        }
    }

	/**
	 * 注入管理类
	 */
    export class MVCInject implements IInject {
        private static INJECTABLE_FULLNAME: string = "__injectable";

        private static injectDefMapping: { [index: string]: { [index: string]: string } } = {};
        private static injectShortNameMapping: { [index: string]: string } = {};
		/**
		 * 
		 * @param o 导出的mvc注入数据
		 */
        public static InitMVCInjectDef(o: { [index: string]: string[] }) {

            for (const key in o) {
                let li = o[key];
                let map = MVCInject.injectDefMapping[key];
                if (map == null) {
                    map = {};
                    MVCInject.injectDefMapping[key] = map;
                    let shortName = key.split(".").pop();
                    if (shortName != key) {
                        MVCInject.injectShortNameMapping[shortName] = key;
                    }
                }

                for (const iterator of li) {
                    let t = iterator.split(":");
                    map[t[0]] = t[1];
                }
            }
        }

        private static injectMapping: Array<ClassInjectData> = new Array<ClassInjectData>();

        public static AddMVC(classPrototype: Function, property: string) {

            let classInjectData: ClassInjectData = null;

            for (let item of MVCInject.injectMapping) {
                if (item.classPrototype == classPrototype) {
                    classInjectData = item;
                    break;
                }
            }

            if (!classInjectData) {
                classInjectData = new ClassInjectData(classPrototype);
                MVCInject.injectMapping.push(classInjectData);
            }

            classInjectData.propertys[property] = 1;
        }

        public static AddCMD(classType: Function, cmd: number, handle: (e: IStream) => void) {

            let classInjectData = null;
            for (let item of MVCInject.injectMapping) {
                if (item.classPrototype == classType) {
                    classInjectData = item;
                    break;
                }
            }

            if (!classInjectData) {
                classInjectData = new ClassInjectData(classType);
                MVCInject.injectMapping.push(classInjectData);
            }

            let list = classInjectData.cmds[cmd];
            if (!list) {
                list = new Array<(e: IStream) => void>();
                classInjectData.cmds[cmd] = list;
            }
            if (list.indexOf(handle) == -1) {
                list.push(handle);
            }
        }

        private facade: IFacade;
        public constructor(facade: IFacade) {
            this.facade = facade;
        }

        private getInjectClassByDef(classInjectData: ClassInjectData, property: string): new () => any {
            let fullClassName = classInjectData.getFullClassName();
            let dic = MVCInject.injectDefMapping[fullClassName];
            if (!dic) {
                fullClassName = MVCInject.injectShortNameMapping[fullClassName];
                dic = MVCInject.injectDefMapping[fullClassName];
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
                for (let item of MVCInject.injectMapping) {
                    if (item.classPrototype == type) {
                        this.doInject(item, target);
                        break;
                    }
                }
                type = Object.getPrototypeOf(type);
            }
            return target;
        }

        protected doInject(classInjectData: ClassInjectData, target: IInjectable) {
            for (let key in classInjectData.propertys) {
                let cls = this.getInjectClassByDef(classInjectData, key);
                if (cls == null) {
                    console.error(target, key, "注入的类型找不到:" + classInjectData.getFullClassName());
                    continue;
                }
                let o = this.autoMVC(cls);
                if (!o) {
                    continue;
                }
                target[key] = o;
                if (key == "view") {
                    (<IMediator>target).setView(o);
                } else if (key == "proxy") {
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
        protected autoMVC(classType: new () => any): any {
            let fullClassName = egret.getQualifiedClassName(classType);
            if (Singleton.IsUnique(fullClassName)) {
                return Singleton.GetInstance(fullClassName);
            }

            let aliasName = fullClassName.split(".").pop();
            let isProxy = ReflectUtils.IsSubclassOf(classType, Proxy);
            let isMediator = ReflectUtils.IsSubclassOf(classType, Mediator);
            if (isProxy || isMediator) {
                Singleton.RegisterClass(classType, aliasName);
            } else {
                let ins = new classType();
                if (ins[MVCInject.INJECTABLE_FULLNAME]) {
                    ins = this.inject(ins);
                }
                return ins;
            }

            if (isMediator && this.facade.hasMediatorByName(aliasName)) {
                return this.facade.getMediatorByName(aliasName);
            } else if (isProxy && this.facade.hasProxyByName(aliasName)) {
                return this.facade.getProxyByName(aliasName);
            }

            let ins = this.facade.getInjectLock(aliasName);
            if (!ins) {
                ins = Singleton.__GetOrCreateOneInstance(aliasName);
                if (ins[MVCInject.INJECTABLE_FULLNAME]) {
                    ins = this.inject(ins);
                }
                if (isMediator) {
                    ins["_name"] = aliasName;
                    this.facade.registerMediator(<IMediator>ins);
                }
                else if (isProxy) {
                    ins["_name"] = aliasName;
                    this.facade.registerProxy(<IProxy>ins);
                }
            }

            return ins;
        }
    }
}
module mvc {
	//不导出
	class ClassInjectData {
		public classType: Function;
		public propertys: { [index: string]: any } = {};

		//typeEvents
		public typeEventHandles: { [index: string]: Array<InjectEventTypeHandle> } = {};
		//指令
		public cmds: { [index: number]: Array<(e: IStream) => void> } = {};
		public constructor(classType: Function) {
			this.classType = classType;
		}
	}

	/**
	 * 注入管理类
	 */
	export class MVCInject implements IInject {
		private static PROXY_FULLNAME: string = "mvc.IProxy";
		private static MEDIATOR_FULLNAME: string = "mvc.IMediator";
		private static INJECTABLE_FULLNAME: string = "mvc.IInjectable";

		private static injectMapping: Array<ClassInjectData> = new Array<ClassInjectData>();

		public static AddMVC(classType: Function, property: string, propertyType: Function) {

			let classInjectData = null;

			for (let item of MVCInject.injectMapping) {
				if (item.classType == classType) {
					classInjectData = item;
					break;
				}
			}

			if (!classInjectData) {
				classInjectData = new ClassInjectData(classType);
				MVCInject.injectMapping.push(classInjectData);
			}

			classInjectData.propertys[property] = propertyType;
		}

		public static AddCMD(classType: Function, cmd: number, handle: (e: IStream) => void) {

			let classInjectData = null;
			for (let item of MVCInject.injectMapping) {
				if (item.classType == classType) {
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

		public inject(target: IInjectable): IInjectable {

			let type = target["__proto__"].constructor;
			for (let item of MVCInject.injectMapping) {
				if (item.classType == type) {
					this.doInject(item, target);
					break;
				}
			}
			return target;
		}

		protected doInject(classInjectData: ClassInjectData, target: IInjectable) {
			for (let key in classInjectData.propertys) {
				let o = this.autoMVC(classInjectData.propertys[key]);
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
		protected autoMVC(classType: any): any {
			let fullClassName = egret.getQualifiedClassName(classType);
			if (Singleton.IsUnique(fullClassName)) {
				return Singleton.GetInstance(fullClassName);
			}

			let aliasName = fullClassName.split(".").pop();
			let isProxy = egret.is(classType, MVCInject.PROXY_FULLNAME);
			let isMediator = egret.is(classType, MVCInject.MEDIATOR_FULLNAME);
			if (isProxy || isMediator) {
				Singleton.RegisterClass(classType, aliasName);
			} else {
				let ins= new classType();
				if(egret.is(classType,MVCInject.INJECTABLE_FULLNAME)){
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
				if (egret.is(ins, MVCInject.INJECTABLE_FULLNAME)) {
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
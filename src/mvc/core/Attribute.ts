const enum InjectEventType {
	Show,
	//always regist facadeDispatchEvent
	Always,
	//proxy event
	Proxy,
}

// 装饰器
let MVC = function (classPrototype, propertyKey: string) {
	mvc.InjectAttribute.AddMVC(classPrototype, propertyKey);
}
//装饰器工厂
function CMD(code: number) {
	return function (classPrototype, propertyKey: string, descriptor: PropertyDescriptor) {
		mvc.InjectAttribute.AddCMD(classPrototype, code, descriptor.value);
	};
}
//装饰器工厂
function MVCE(type: InjectEventType, ...events: Array<string>) {
	return function (classPrototype: mvc.IEventInterester, propertyKey: string, descriptor: PropertyDescriptor) {
		//如果没有事件;
		if (events.length == 0) {
			return;
		}

		let eventInteresting: { [index: string]: Array<mvc.InjectEventTypeHandle> } = classPrototype.__eventInteresting;
		if (!eventInteresting) {
			eventInteresting = {};
			classPrototype.__eventInteresting = eventInteresting;
		}
		let list = eventInteresting[type];
		if (!list) {
			list = new Array<mvc.InjectEventTypeHandle>();
			eventInteresting[type] = list;
		}
		let ins = new mvc.InjectEventTypeHandle(type, events, descriptor.value);
		list.push(ins);
	};
}

namespace mvc{
	export class InjectEventTypeHandle {
		public constructor(public injectType: InjectEventType, public events: Array<string>, public handle: (EventX) => void) { }
	}
	export class InjectClassData {
		public propertys: { [index: string]: any } = {};
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
	export class InjectAttribute{
		private static readonly injectMapping: Array<InjectClassData> = new Array<InjectClassData>();
        static Get(type: any): InjectClassData {
			for (let item of InjectAttribute.injectMapping) {
				if (item.classPrototype == type) {
					return item;
				}
			}
			return null;
        }
	
        public static AddMVC(classPrototype: Function, property: string) {
            let classInjectData: InjectClassData = null;
            for (let item of this.injectMapping) {
                if (item.classPrototype == classPrototype) {
                    classInjectData = item;
                    break;
                }
            }
            if (!classInjectData) {
                classInjectData = new InjectClassData(classPrototype);
                InjectAttribute.injectMapping.push(classInjectData);
            }
            classInjectData.propertys[property] = 1;
        }
        public static AddCMD(classPrototype: Function, cmd: number, handle: (e: IStream) => void) {
            let classInjectData = null;
            for (let item of InjectAttribute.injectMapping) {
                if (item.classPrototype == classPrototype) {
                    classInjectData = item;
                    break;
                }
            }
            if (!classInjectData) {
                classInjectData = new InjectClassData(classPrototype);
                InjectAttribute.injectMapping.push(classInjectData);
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

	}
}

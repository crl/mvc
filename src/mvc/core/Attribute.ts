const enum InjectEventType {
	Show,
	//always regist facadeDispatchEvent
	Always,
	//proxy event
	Proxy,
}

// 装饰器
let MVC = function (classPrototype, propertyKey: string) {
	mvc.MVCInject.AddMVC(classPrototype, propertyKey);
}
//装饰器工厂
function CMD(code: number) {
	return function (classPrototype, propertyKey: string, descriptor: PropertyDescriptor) {
		mvc.MVCInject.AddCMD(classPrototype, code, descriptor.value);
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
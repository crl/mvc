const enum InjectEventType {
    Show,
    //always regist facadeDispatchEvent
    Always,
    //proxy event
    Proxy,
}
function TT(a:any){
    return function (target: any, propertyKey: string) {
    }
}
// 装饰器
let MVC = function (target: any, propertyKey: string) {
    let propertyType = Reflect.getMetadata('design:type', target, propertyKey);
    mvc.MVCInject.AddMVC(target["constructor"], propertyKey, propertyType);
}
//装饰器工厂
function CMD(code: number) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        mvc.MVCInject.AddCMD(target["constructor"], code, descriptor.value);
    };
}
//装饰器工厂
function MVCE(type: InjectEventType, ...events: Array<string>) {
    return function (target:mvc.IEventInterester, propertyKey: string, descriptor: PropertyDescriptor) {
        //如果没有事件;
        if(events.length==0){
            return;
        }

        let eventInteresting:{[index:string]:Array<mvc.InjectEventTypeHandle>}=target.__eventInteresting;
        if(!eventInteresting){
            eventInteresting={};
            target.__eventInteresting=eventInteresting;
        }
        let list=eventInteresting[type];
        if(!list){
            list=new Array<mvc.InjectEventTypeHandle>();
            eventInteresting[type]=list;
        }
        let ins = new mvc.InjectEventTypeHandle(type, events, descriptor.value);
        list.push(ins);
    };
}

module mvc {
	export interface IPanel extends IAsync,IEventDispatcher {
		readonly isShow:boolean;
		__refMediator:IMediator;
		show(container?:egret.DisplayObjectContainer);
		hide();
		bringTop();
	}
}
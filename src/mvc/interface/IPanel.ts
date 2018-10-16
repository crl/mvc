module mvc {
	export interface IPanel extends IAsync,egret.IEventDispatcher {
		readonly isShow:boolean;
		__refMediator:IMediator;
		show(container?:egret.DisplayObjectContainer);
		hide();
		bringTop();
	}
}
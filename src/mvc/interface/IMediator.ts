namespace mvc {
	export interface IMediator extends IMVCHost {
		
 		setView(value:IPanel);
		getView():IPanel;
		
		setProxy(value:IProxy);
		getProxy():IProxy;

		toggleSelf(type:number);
	}
}
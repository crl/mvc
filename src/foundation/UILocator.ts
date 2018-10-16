class UILocator {
	private static _CanvasLayer: egret.DisplayObjectContainer;
	public static get CanvasLayer(): egret.DisplayObjectContainer {
		return UILocator._CanvasLayer;
	}

	private static _PopUpLayer: egret.DisplayObjectContainer;
	public static get PopUpLayer(): egret.DisplayObjectContainer {
		return UILocator._PopUpLayer;
	}

	private static _TipLayer: egret.DisplayObjectContainer;
	public static get TipLayer(): egret.DisplayObjectContainer {
		return UILocator._TipLayer;
	}

	private static _UILayer: egret.DisplayObjectContainer;
	public static get UILayer(): egret.DisplayObjectContainer {
		return UILocator._UILayer;
	}

	private static _FollowLayer: egret.DisplayObjectContainer;
	public static get FollowLayer(): egret.DisplayObjectContainer {
		return UILocator._FollowLayer;
	}

	private static _Root: egret.DisplayObjectContainer;
	public static get Root(): egret.DisplayObjectContainer {
		return UILocator._Root;
	}

	public static Init(root: egret.DisplayObjectContainer) {
		UILocator._Root = root;

		UILocator._CanvasLayer = UILocator.newLayer();
		UILocator._PopUpLayer = UILocator.newLayer();
		UILocator._TipLayer = UILocator.newLayer();
		UILocator._UILayer = UILocator.newLayer();
		UILocator._FollowLayer = UILocator.newLayer();
	}

	private static newLayer(): egret.DisplayObjectContainer {
		let layer = new egret.Sprite();
		UILocator._Root.addChild(layer);
		return layer;
	}

}
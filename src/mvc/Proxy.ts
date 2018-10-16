module mvc {
	export class Proxy extends AbstractMVHost implements IProxy {

		protected load() {
			//todo;
			this._isReady = true;
			this.dispatchReayHandle();
		}
	}
}
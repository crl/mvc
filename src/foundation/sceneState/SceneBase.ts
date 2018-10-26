namespace foundation
{
    export abstract class SceneBase extends AbstractState
    {
        protected _resizeable:boolean = false;
        protected facade:mvc.IFacade;
        public SceneBase(type:string) 
        {
            this._type = type;
        }

        initialize()
        {
            this.facade = Facade.GetInstance();
            if (this[mvc.MVCInject.INJECTABLE])
            {
                let t:any=this;
                this.facade.inject(t);
            }
            this.facade.autoInitialize(this.type);

            this.facade.addEventListener(EventX.CLEAR_CACHE, this.onClearCache,this);
            super.initialize();
        }

        protected onClearCache(e:EventX)
        {

        }
    }
}

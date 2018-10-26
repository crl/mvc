
namespace foundation {
    export class MiEventX {
        $mType: string;
        $mData: any;
        $mTarget: IEventDispatcher;
        constructor(type: string, data?: object) {
            this.$mType = type;
            this.$mData = data;
        }
        get target(): IEventDispatcher {
            return this.$mTarget;
        }
        get type(): string {
            return this.$mType;
        }
        get data(): any {
            return this.$mData;
        }
        $setTarget(value: IEventDispatcher) {
            this.$mTarget = value;
        }
    }
}

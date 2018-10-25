class ReflectUtils {
   

	public static IsSubclassOf(type:new()=>any, superType: any): boolean {
		let r=type.prototype;
		while(r){
			let p=Object.getPrototypeOf(r);
			if(p===superType.prototype){
				return true;
			}
			r=r.prototype;
		}

		return false;
	}
	public static IsSubClassInstanceOf(instance:any, superType: any): boolean {
		return superType.isPrototypeOf(instance);
	}
}
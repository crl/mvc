class ReflectUtils {

	public static IsSubclassOf(instance: any, typeName: string|{new():any}): boolean {
		var prototype = instance.prototype;
		var types = prototype ? prototype.__types__ : null;
		if (!types) {
			return false;
		}
		if(typeof typeName =="string"){
			return (types.indexOf(typeName) !== -1);
		}

		let superTypeName=egret.getQualifiedClassName(typeName);
		return (types.indexOf(superTypeName) !== -1);
	}
}
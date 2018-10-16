class ReflectUtils {

	public static IsSubclassOf(type: any, typeName: string): boolean {
		var prototype = type.prototype;
		var types = prototype ? prototype.__types__ : null;
		if (!types) {
			return false;
		}
		return (types.indexOf(typeName) !== -1);
	}
}
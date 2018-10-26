class DebugX{
	static Warn(message?: any, ...optionalParams: any[]) {
        console.warn(message,optionalParams);
    }
    static Log(message?: any, ...optionalParams: any[]) {
        console.log(message,optionalParams);
    }
    static LogError(message?: any, ...optionalParams: any[]) {
        console.error(message,optionalParams);
        
        let msg=message;
        if(!msg){
            msg="null";
        }
        for (const iterator of optionalParams) {
            if(!iterator){
                msg+=",null";
            }else{
                msg+=","+iterator.toString();
            }
        }
        alert(msg);
    }
    
}
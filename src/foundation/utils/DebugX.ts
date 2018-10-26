class DebugX {
    static Warn(message?: any, ...optionalParams: any[]) {
        console.warn.apply(console.log, arguments);
    }
    static Log(message?: any, ...optionalParams: any[]) {
        console.log.apply(console.log, arguments);
    }
    static LogError(message?: any, ...optionalParams: any[]) {
        console.error.apply(console.log, arguments);

        let msg = message;
        if (!msg) {
            msg = "null";
        }
        for (const iterator of optionalParams) {
            if (!iterator) {
                msg += " null";
            } else {
                msg += " " + iterator.toString();
            }
        }
        alert(msg);
    }

}
class DebugX{
    static LogError(...args): any {
        console.log.call(console,arguments);
    }
    
}
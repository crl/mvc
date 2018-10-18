namespace mvc {
    export class MacroCommand implements ICommand {
        subCommands: Function[] = null;

        addSubCommand<T extends ICommand>(commandClassRef: new()=>T): void {
            this.subCommands.push(commandClassRef);
        }
        execute(e: EventX): void {
            let subCommands: Function[] = this.subCommands.slice(0);
            var len: number = this.subCommands.length;
            for (let i = 0; i < len; i++) {
                var commandClassRef: any = subCommands[i];
                var commandInstance: ICommand = <ICommand>new commandClassRef();
                commandInstance.execute(e);
            }
            this.subCommands.splice(0);
        }
    }
}
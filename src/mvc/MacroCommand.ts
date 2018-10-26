namespace mvc {
    export class MacroCommand implements ICommand {
        subCommands: ClassT<ICommand>[] = null;

        addSubCommand<T extends ICommand>(commandClassRef: ClassT<T>): void {
            this.subCommands.push(commandClassRef);
        }
        execute(e: EventX): void {
            let subCommands = this.subCommands.slice(0);
            var len: number = this.subCommands.length;
            for (let i = 0; i < len; i++) {
                var commandClassRef = subCommands[i];
                var commandInstance = new commandClassRef();
                commandInstance.execute(e);
            }
            this.subCommands.splice(0);
        }
    }
}
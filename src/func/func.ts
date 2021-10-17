import {Command} from "commander";

export abstract class Func {
    private name: string;
    protected constructor(name: string) {
        this.name = name;
    }

    public abstract run(currentPath: string, command: Command): void;
}
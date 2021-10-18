export abstract class Func {
    private name: string;
    protected constructor(name: string) {
        this.name = name;
    }

    public abstract run(currentPath: string, args: string[]): void;
}
export class CommandOption {
    public readonly name: string;
    public readonly shortName: string | undefined;
    private value: string[] = [];
    private exist = false;

    constructor(name: string, shortName?: string) {
        this.name = name;
        this.shortName = shortName;
    }

    public setExist(exist: boolean): void {
        this.exist = exist;
    }

    public getExist(): boolean {
        return this.exist;
    }

    public addValue(value: string): void {
        this.value.push(value);
    }

    public hasValue(): boolean {
        return this.value.length > 0;
    }

    public getValues(): string[] {
        return this.value;
    }

    public getArgsFormat(): string[] {
        const formats: string[] = [];
        formats.push("--" + this.name);
        if (this.shortName !== undefined) formats.push("-" + this.shortName);
        return formats;
    }
}
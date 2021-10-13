import {Func} from "../func";

export class BuildFunc extends Func {
    public static _instance: BuildFunc = new BuildFunc();

    private constructor() {
        super("build");
    }

    override run(currentPath: string, argv: string[]) {
        console.log("build");
    }
}
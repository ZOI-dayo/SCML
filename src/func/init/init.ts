import fs from "fs";
import {Func} from "../func";

export class InitFunc extends Func {
    public static _instance: InitFunc = new InitFunc();

    private constructor() {
        super("init");
    }

    override run(currentPath: string, argv: string[]) {
        console.log(fs.readdirSync(currentPath));
        console.log("init");
    }
}
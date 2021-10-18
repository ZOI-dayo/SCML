import colors from "colors";
import {InitFunc} from "./func/init/init";
import {BuildFunc} from "./func/build/build";
import {Func} from "./func/func";

const appMessage: string =
    "\n" +
    "    +-------------------------------------+\n" +
    "    | SCML                                |\n" +
    "    |  Simple Component Markup Language   |\n" +
    "    |                                     |\n" +
    "    | # Init project                      |\n" +
    "    |     `$ npx scml init`               |\n" +
    "    | # Build files                       |\n" +
    "    |     `$ npx scml build`              |\n" +
    "    |                                     |\n" +
    "    +-------------------------------------+\n" +
    "\n";

const notFoundErrMessage: (name: string) => string = (name: string) => {
    return "\n" +
        "[" + colors.red("ERROR") + "]: \"" + name + "\" not found\n" +
        "\n";
};

const funcList: { [key: string]: Func; } = {
    "init": InitFunc._instance,
    "build": BuildFunc._instance,
};

function run(currentPath: string, args: string[]): void {
    if (args.length === 0) {
        console.log(appMessage);
        return;
    }
    const funcName: string = args[0];
    const functions: string[] = Object.keys(funcList);
    if (functions.includes(funcName)) {
        console.log(appMessage);
        const func: Func = funcList[funcName];
        func.run(currentPath, args);
        return;
    } else {
        console.log(notFoundErrMessage(funcName) + appMessage);
        return;
    }
}

export const onCommand: (currentPath: string, args: string[]) => void = (currentPath: string, args: string[]) => run(currentPath, args);
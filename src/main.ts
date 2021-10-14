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

function run(currentPath: string, argv: string[]): void {
    if (argv.length === 0) {
        return;
    }
    const funcName: string = argv[0];
    const functions: string[] = Object.keys(funcList);
    if (functions.includes(funcName)) {
        console.log(appMessage);
        const func: Func = funcList[funcName];
        func.run(currentPath, argv.slice(1));
        return;
    } else {
        console.log(notFoundErrMessage(funcName) + appMessage);
        return;
    }
}

export const onCommand: (currentPath: string, argv: string[]) => void = (currentPath: string, argv: string[]) => run(currentPath, argv);
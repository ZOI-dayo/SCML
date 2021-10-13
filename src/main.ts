import colors from "colors";

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
    "\n"

const notFoundErrMessage: Function = (name: string) => {
    return "\n" +
        "[" + colors.red("ERROR") + "]: \"" + name + "\" not found\n" +
        "\n"
};

export const scml: Function = (argv: string[]) => {
    console.log(appMessage);
    if (argv.length === 0) {
        return;
    }
    const funcName: string = argv[0];
    const functions: string[] = ["init", "build"]
    if (functions.includes(funcName)) {
        const func = require('./func/' + funcName);
        func.run(argv.slice(1));
        return;
    } else {
        console.log(notFoundErrMessage(funcName) + appMessage);
        return;
    }
}
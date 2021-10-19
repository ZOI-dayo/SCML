import colors from "colors";
import {InitFunc} from "./func/init/init";
import {BuildFunc} from "./func/build/build";
import {Func} from "./func/func";
import {DevFunc} from "./func/dev/dev";
import {Exception} from "./class/Exception";

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
    "    | # Run development server            |\n" +
    "    |                                     |\n" +
    "    +-------------------------------------+\n" +
    "\n";

const funcList: { [key: string]: Func; } = {
    "init": InitFunc._instance,
    "build": BuildFunc._instance,
    "dev": DevFunc._instance,
};

function run(currentPath: string, args: string[]): void {
    APP_LOGGER.print(appMessage);
    if (args.length === 0) {
        return;
    }
    const funcName: string = args[0];
    const functions: string[] = Object.keys(funcList);
    if (functions.includes(funcName)) {
        const func: Func = funcList[funcName];
        func.run(currentPath, args);
        return;
    } else {
        new OptionNotFoundError(funcName).throw();
        return;
    }
}

export const onCommand: (currentPath: string, args: string[]) => void = (currentPath: string, args: string[]) => run(currentPath, args.slice(2));

export class Logger {
    private readonly owner: string;

    public constructor(owner: string) {
        this.owner = owner;
    }

    public print(message: string): string {
        console.log(message);
        return message;
    }

    public log(message: string): string {
        const text = `[ ${this.owner} ] ${message}`;
        console.log(text);
        return text;
    }

    public warn(message: string): string {
        const text = `[ ${colors.yellow(this.owner + " : WARN")} ] ${message}`;
        console.log(text);
        return text;
    }

    public error(message: string): string {
        const text = `[ ${colors.red(this.owner + " : ERROR")} ] ${message}`;
        console.log(text);
        return text;
    }
}

export class FileNotFoundError extends Exception {
    constructor(fileName: string) {
        super(`File ${fileName} not found.`);
    }
}

export class OptionNotFoundError extends Exception {
    constructor(optionName: string) {
        super(`Option ${optionName} not found.`);
    }
}

export const APP_LOGGER = new Logger("SCML");
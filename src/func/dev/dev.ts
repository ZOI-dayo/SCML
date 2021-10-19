import {Func} from "../func";
import fs from "fs";
import {CommandOption} from "../../command/CommandOption";
import {BuildFunc, BuildInfo, Command} from "../build/build";
import {Server} from "./server";

export class DevFunc extends Func {
    public static _instance: DevFunc = new DevFunc();

    private constructor() {
        super("dev");
    }

    override run(currentPath: string, args: string[]): void {
        const build: () => void = () => BuildFunc._instance.run(currentPath, args);
        build();
        const devInfo: DevInfo = new DevInfo(new BuildInfo(currentPath, args, BuildFunc.commandOptions), [
            new CommandOption("port", "p"), // Webサーバーに割り当てるポート番号を指定できます。(デフォルト:8080)
        ]);
        const server: Server = new Server(devInfo.buildInfo.distDir, devInfo.port);
        const watcher: fs.FSWatcher = fs.watch(devInfo.buildInfo.srcDir, (/*event: "rename" | "change", filename: string*/) => {
            build();
            server.logger.log("Reloaded.");
        });
        process.on("SIGINT", function () {
            server.stop();
            watcher.close();
            process.exit();
        });
        server.start();
    }
}

export class DevInfo {
    public readonly command: Command;
    public readonly buildInfo: BuildInfo;

    public get port(): number {
        return Number.parseInt(this.command.options.filter(option => option.name === "port")[0]?.getValues()[0] ?? "8080");
    }

    constructor(buildInfo: BuildInfo, options: CommandOption[]) {
        this.buildInfo = buildInfo;
        this.command = new Command(buildInfo.args, options);
    }
}
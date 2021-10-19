import {Func} from "../func";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import {Component} from "../../class/HtmlContent/Component";
import {Page} from "../../class/HtmlContent/Page";
import {InternalComponentsLoader} from "../../components/InternalComponentsLoader";
import {CommandOption} from "../../command/CommandOption";
import {APP_LOGGER} from "../../main";

export class BuildFunc extends Func {
    public static _instance: BuildFunc = new BuildFunc();

    private constructor() {
        super("build");
    }

    override run(currentPath: string, args: string[]): void {
        const tempFiles: string[] = [];
        const buildInfo = new BuildInfo(currentPath, args, [
            // new CommandOption("lang", "l"), // 対応しているコンポーネントにおいて言語設定を変更できます。
            new CommandOption("src", "s"), // ソースディレクトリを変更できます。(デフォルト:pages)
            new CommandOption("out", "o"), // 出力ディレクトリを変更できます。(デフォルト:dist)
        ]);
        APP_LOGGER.log("initializing dist directory...");
        BuildFunc.prepareDir(buildInfo);
        APP_LOGGER.log("initialize finish.");
        buildInfo.getConfig()?.plugins?.forEach(plugin => {
            const srcFiles: string[] = BuildFunc.getFiles(buildInfo.srcDir, buildInfo.srcDir)
                .filter(p => p.endsWith(plugin.srcExtension));
            const templateFile: string = fs.readFileSync(path.join(buildInfo.currentDir, plugin.template), "utf-8");
            srcFiles.forEach(fPath => {
                // const pluginTempPath = path.join(buildInfo.tempDir, "plugin", plugin.name);
                // fs.rmdirSync(pluginTempPath, {recursive: true});
                // fs.mkdirSync(path.dirname(path.join(pluginTempPath, fPath)), {recursive: true});
                // fs.copyFileSync(path.join(buildInfo.pagesDir, fPath), path.join(pluginTempPath, fPath));

                // APP_LOGGER.error(plugin.targetText);
                // APP_LOGGER.error(plugin.targetText.match(/#\\{.+?\\}/g)?.toString() ?? "null!!!");
                const replaceText = plugin.targetText.replace(/#\{.+?\}/g, match => {
                    // APP_LOGGER.error("match");
                    const script: string = match.slice(2, -1).trim();
                    const rootText: string = script.replace(/(.*?)/g, "").trim();
                    let result = rootText
                        .replace("PATH", path.join(buildInfo.srcDir, fPath));
                    // .replace("SRC_PATH", path.join(pluginTempPath, fPath));
                    const functions: string[][] = [];
                    script.match(/(.*?)/g)?.forEach(func => {
                        functions.push(func.slice(1, -1).trim().replace(/\s+/g, " ").split(" "));
                    });
                    // ここから現時点では不要
                    functions.forEach(fArg => {
                        if (fArg[0] === "del") {
                            const count: number = Number.parseInt(fArg[1] ?? "0");
                            result = result.slice(0, count);
                        } else if (fArg[0] === "add") {
                            const additionText: string = fArg[1] ?? "";
                            result += additionText;
                        }
                    });
                    // ここまで
                    // APP_LOGGER.log(result);
                    // APP_LOGGER.error(result);
                    return result;
                });

                const compiledDocument: string = templateFile.replace(plugin.parseText, replaceText);

                // APP_LOGGER.error("compiledDocument : " + compiledDocument);
                const releasePath: string = path.join(buildInfo.srcDir, fPath.slice(0, -1 * plugin.srcExtension.length) + plugin.targetExtension);

                // APP_LOGGER.error("releasePath : " + releasePath);
                tempFiles.push(releasePath);
                if (!fs.existsSync(path.dirname(releasePath))) fs.mkdirSync(path.dirname(releasePath));
                fs.writeFileSync(releasePath, compiledDocument, {encoding: "utf8"});
            });
        });
        const components: { [key: string]: Component } = this.loadComponents(buildInfo.currentDir);
        const pages: { [key: string]: Page } = BuildFunc.loadPages(buildInfo.currentDir);
        for (const name in pages) {
            const page: Page = pages[name];
            const compiled: string = page.compile(components, buildInfo);
            type PrettierType = { format: (src: string, option: { semi: boolean, parser: string }) => string };
            const formatted: string = (prettier as PrettierType).format(compiled, {
                semi: false,
                parser: "html"
            });
            const filePath = path.join(buildInfo.distDir, name + ".html");
            if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), {recursive: true});
            fs.writeFileSync(path.join(buildInfo.distDir, name + ".html"), formatted, {encoding: "utf8"});
        }
        BuildFunc.getFiles(buildInfo.staticDir, buildInfo.staticDir).forEach(fPath => {
            const distFilePath = path.join(buildInfo.distDir, fPath);
            if (!fs.existsSync(path.dirname(distFilePath))) fs.mkdirSync(path.dirname(distFilePath), {recursive: true});
            fs.copyFileSync(path.join(buildInfo.staticDir, fPath), distFilePath);
        });
        tempFiles.forEach(f => {
            fs.rmSync(f);
        });
    }

    private static prepareDir(buildInfo: BuildInfo): void {
        if (fs.existsSync(buildInfo.distDir)) {
            APP_LOGGER.log("clearing dist directory...");
            fs.rmdirSync(buildInfo.distDir, {recursive: true});
        }
        fs.mkdirSync(buildInfo.distDir);
    }

    private loadComponents(projectPath: string): { [key: string]: Component } {
        const componentsPath: string = path.join(projectPath, "components");

        const fileList: string[] = BuildFunc.getFiles(componentsPath, componentsPath);
        const components: { [key: string]: Component } = {};
        const pluginComponents: Component[] = InternalComponentsLoader.load();
        pluginComponents.forEach(pComp => components[pComp.name] = pComp);

        fileList.forEach(fName => {
            const content: string = fs.readFileSync(path.join(componentsPath, fName), "utf-8");
            const name: string = path.basename(fName, path.extname(fName));
            components[name] = new Component(name, content);
        });
        return components;
    }

    private static loadPages(projectPath: string): { [key: string]: Page } {
        const pagesPath: string = path.join(projectPath, "pages");
        const fileList: string[] = BuildFunc.getFiles(pagesPath, pagesPath);
        const pages: { [key: string]: Page } = {};
        for (const fName of fileList) {
            if (!fName.endsWith(".html")) continue;
            const content: string = fs.readFileSync(path.join(pagesPath, fName), "utf-8");
            const name: string = path.join(path.dirname(fName), path.basename(fName, path.extname(fName)));
            pages[name] = new Page(name, content);
        }
        return pages;
    }

    private static getFiles(rootPath: string, searchPath: string): string[] {
        const allFiles: string[] = [];
        const dirElements: string[] = fs.readdirSync(searchPath);
        dirElements.forEach((el) => {
            const elPath: string = path.join(searchPath, el);
            const elStat: fs.Stats = fs.statSync(elPath);
            if (elStat.isFile()) allFiles.push(path.relative(rootPath, elPath));
            else if (elStat.isDirectory()) {
                const innerFiles: string[] = BuildFunc.getFiles(rootPath, elPath);
                innerFiles.forEach(file => {
                    allFiles.push(file);
                });
            }
        });
        return allFiles;
    }
}

export class BuildInfo {
    public readonly currentDir: string;
    public readonly args: string[];
    public readonly config: ConfigFileFormat | undefined;
    public readonly options: CommandOption[];

    public get staticDir(): string {
        return path.join(this.currentDir, "static");
    }

    public get distDir(): string {
        return path.join(
            this.currentDir,
            this.options.filter(option => option.name === "out")[0]?.getValues()[0] ?? "dist"
        );
    }

    public get assetsDir(): string {
        return path.join(this.currentDir, "assets");
    }

    public get srcDir(): string {
        return path.join(this.currentDir, this.src);
    }

    public get tempDir(): string {
        return path.join(this.currentDir, ".temp", "scml");
    }

    public get src(): string {
        return this.options.filter(option => option.name === "src")[0]?.getValues()[0] ?? "pages";
    }

    public hasOption(optionName: string): boolean {
        return this.options.filter(option => option.name === optionName || option.shortName === optionName).filter(option => option.getExist()).length > 0;
    }

    public getConfig(): ConfigFileFormat | undefined {
        return this.config;
    }

    constructor(currentDir: string, args: string[], options: CommandOption[]) {
        this.currentDir = currentDir;
        this.args = args;
        this.options = options;
        let compilingOptionIndex = -1;
        for (const arg of args) {
            if (arg.startsWith("-")) {
                let optionName: string = arg;
                let hyphenCounter = 0;
                while (optionName.startsWith("-")) {
                    hyphenCounter++;
                    optionName = optionName.slice(1);
                }
                options.filter(option => {
                    if (hyphenCounter === 1) {
                        return option.shortName === optionName;
                    } else if (hyphenCounter === 2) {
                        return option.name === optionName;
                    }
                }).forEach(option => {
                    option.setExist(true);
                    compilingOptionIndex = options.indexOf(option);
                });
            } else {
                if (compilingOptionIndex < 0) continue;
                const option = options[compilingOptionIndex];
                option.addValue(arg);
            }
        }
        const configPath = path.join(currentDir, "scml.json");
        if (fs.existsSync(configPath)) {
            this.config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as ConfigFileFormat;
        }
    }
}

interface ConfigFileFormat {
    plugins: ConfigPluginFormat[] | undefined;
}

interface ConfigPluginFormat {
    name: string;
    srcExtension: string;
    targetExtension: string;
    template: string;
    parseText: string;
    targetText: string;
}
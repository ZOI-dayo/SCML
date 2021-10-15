import {Func} from "../func";
import fs from "fs";
import path from "path";
import prettier from "prettier";

// import {JSDOM} from "jsdom";

export class BuildFunc extends Func {
    public static _instance: BuildFunc = new BuildFunc();

    private constructor() {
        super("build");
    }

    override run(currentPath: string, argv: string[]): void {
        console.log("initializing dist directory...");
        BuildFunc.prepareDir(currentPath);
        console.log("initialize finish.");
        const components: { [key: string]: Component } = this.loadComponents(currentPath);
        const pages: { [key: string]: Page } = this.loadPages(currentPath);
        for (const name in pages) {
            const page: Page = pages[name];
            const compiled: string = page.compile(components);

            console.log("---");
            type PrettierType = { format: (src: string, option: { semi: boolean, parser: string }) => string };
            const formatted: string = (prettier as PrettierType).format(compiled, {
                semi: false,
                parser: "html"
            });
            console.log(formatted);
        }
    }

    private static prepareDir(projectPath: string): void {
        const distPath: string = path.join(projectPath, "dist");
        if (fs.existsSync(distPath)) {
            console.log("clearing dist directory...");
            fs.rmdirSync(distPath, {recursive: true});
        }
        fs.mkdirSync(distPath);
    }

    private loadComponents(projectPath: string): { [key: string]: Component } {
        const componentsPath: string = path.join(projectPath, "components");

        const fileList: string[] = BuildFunc.getFiles(componentsPath, componentsPath);
        const components: { [key: string]: Component } = {};
        fileList.forEach(fName => {
            const content: string = fs.readFileSync(path.join(componentsPath, fName), "utf-8");
            const name: string = path.basename(fName, path.extname(fName));
            components[name] = new Component(name, content);
        });
        return components;
    }

    private loadPages(projectPath: string): { [key: string]: Page } {
        const pagesPath: string = path.join(projectPath, "pages");
        const fileList: string[] = BuildFunc.getFiles(pagesPath, pagesPath);
        const pages: { [key: string]: Page } = {};
        fileList.forEach(fName => {
            const content: string = fs.readFileSync(path.join(pagesPath, fName), "utf-8");
            const name: string = path.basename(fName, path.extname(fName));
            pages[name] = new Page(name, content);
        });
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

class HtmlContent {
    public readonly name: string;
    private readonly document: string;
    private compiledDocument: string;
    private style = "";

    public constructor(name: string, content: string) {
        this.name = name;
        this.document = content;
        this.compiledDocument = this.document;
    }

    protected compile(components: { [key: string]: Component }, resolved: string[]): string {
        if (resolved.includes(this.name)) return this.document;
        resolved.push(this.name);
        this.compiledDocument = this.document;
        for (const name in components) {
            const component = components[name];
            // const tagPattern = new RegExp("< *" + component.name + "(.*?)\\/>", "g");
            const tagPattern = /< *MyComponent(.*?)\/>/g;
            this.compiledDocument = this.compiledDocument.replace(tagPattern, (match: string): string => {
                return HtmlContent.compileFromTag(components, component, match, resolved);
            });
        }
        return this.compiledDocument;
    }

    private static compileFromTag(components: { [key: string]: Component }, component: Component, tag: string, resolved: string[]): string {
        const options: { [key: string]: string } = {};
        const keyValueOptionPattern = new RegExp("\\S+((=\".+?\")|[^\\s\\S])", "g");
        // const simpleOptionPattern = new RegExp("\\S*=\"\\S*\"", "g");
        tag.match(keyValueOptionPattern)?.forEach((optionPairStr: string) => {
            const splittedStr: string[] = optionPairStr.split("=");
            const optionKey: string = splittedStr[0];
            options[optionKey] = splittedStr[1].slice(1, -1);
        });
        tag.trim().split(" ")
            .map(str => {
                return str.trim();
            })
            .filter(str => {
                return str.search(/([^a-zA-Z0-9_-])+/) === -1;
            }).forEach(str => options[str] = "");
        return component.compile(components, resolved, options);
    }
}

class Component extends HtmlContent {
    public override compile(components: { [key: string]: Component }, resolved: string[], options?: { [key: string]: string }): string {
        if (options !== null) {
            console.log(options);
        }
        return super.compile(components, resolved);
    }
}

class Page extends HtmlContent {
    public compile(components: { [key: string]: Component }): string {
        return super.compile(components, []);
    }
}
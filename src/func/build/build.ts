import {Func} from "../func";
import fs from "fs";
import path from "path";

// import {JSDOM} from "jsdom";

export class BuildFunc extends Func {
    public static _instance: BuildFunc = new BuildFunc();

    private constructor() {
        super("build");
    }

    override run(currentPath: string, argv: string[]) {
        console.log("initializing dist directory...");
        BuildFunc.prepareDir(currentPath);
        console.log("initialize finish.");
        const components: { [key: string]: Component } = this.loadComponents(currentPath);
        const pages: { [key: string]: Page } = this.loadPages(currentPath);
        for (const name in pages) {
            const page: Page = pages[name];
            const compiled: string = page.compile(components);
            console.log(compiled)
        }
    }

    private static prepareDir(projectPath: string) {
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
        const components: { [key: string]: Component } = {}
        fileList.forEach(fName => {
            const content: string = fs.readFileSync(path.join(componentsPath, fName), "utf-8");
            const name: string = path.basename(fName, path.extname(fName))
            components[name] = new Component(name, content);
        });
        return components;
    }

    private loadPages(projectPath: string): { [key: string]: Page } {
        const pagesPath: string = path.join(projectPath, "pages");
        const fileList: string[] = BuildFunc.getFiles(pagesPath, pagesPath);
        const pages: { [key: string]: Page } = {}
        fileList.forEach(name => {
            const content: string = fs.readFileSync(path.join(pagesPath, name), "utf-8");
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
                    allFiles.push(file)
                });
            }
        });
        return allFiles;
    }
}

class Component {
    private name;
    // public document: JSDOM;
    public document: string;

    constructor(name: string, content: string) {
        this.name = name;
        // this.document = new JSDOM(content);
        this.document = content;
    }

    public compile(components: { [key: string]: Component }, options: { [key: string]: string }): string {
        for (const name in components) {
            const component = components[name];
            /*
            const elements: HTMLCollectionOf<Element> = this.document.window.document.getElementsByTagName(name);
            if (elements.length === 0) continue;
            for (let i = 0; i < elements.length; i++) {
                const elem: Element | null = elements.item(i);
                if(elem === null) continue;
                elem.replaceWith(component.compile(components));
            }
            */
            const tagPattern = new RegExp("< *" + component.name + "(.*?)\\/>", 'g');
            this.document.match(tagPattern)?.forEach((node: string, index: number) => {
                const options: { [key: string]: string } = {}
                const optionPattern = /\S*="\S*"/g;
                node.match(optionPattern)?.forEach((optionPairStr: string) => {
                    const splittedStr: string[] = optionPairStr.split('=');
                    const optionKey: string = splittedStr[0];
                    options[optionKey] = splittedStr[1].slice(1, -1);
                })
                node.replace(node, component.compile(components, options));
            });
        }
        return this.document.toString();
    }
}

class Page {
    private name;
    public document: JSDOM;

    constructor(name: string, content: string) {
        this.name = name;
        this.document = new JSDOM(content);
    }

    public compile(components: { [key: string]: Component }): string {
        console.log(`elem : ${components.toString()}`);
        for (const name in components) {
            console.log("name : " + name);
            const component = components[name];
            const elements: HTMLCollectionOf<Element> = this.document.window.document.getElementsByTagName(name);
            console.log(`elements : ${elements.toString()}`);
            if (elements.length === 0) continue;
            for (let i = 0; i < elements.length; i++) {
                const elem: Element | null = elements.item(i);
                if (elem === null) continue;
                console.log(`elem : ${elem.toString()}`);
                elem.replaceWith(component.compile(components));
                console.log(`a`);
            }
            // for (const elem in elements) {
            //     console.log("elem : " + elem);
            //     // elem.replaceWith(component.node);
            // }
        }
        console.log("elem exit");
        return this.document.serialize();
    }
}
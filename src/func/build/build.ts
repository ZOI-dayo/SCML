import {Func} from "../func";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import {Component} from "../../class/HtmlContent/Component";
import {Page} from "../../class/HtmlContent/Page";
import {InternalComponentsLoader} from "../../components/InternalComponentsLoader";

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
        const pluginComponents: Component[] = InternalComponentsLoader.load();
        pluginComponents.forEach(pComp => components[pComp.name] = pComp);

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
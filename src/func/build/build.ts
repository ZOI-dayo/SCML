import {Func} from "../func";
import fs from "fs";
import path from "path";
import {JSDOM} from "jsdom";

export class BuildFunc extends Func {
    public static _instance: BuildFunc = new BuildFunc();

    private constructor() {
        super("build");
    }

    override run(currentPath: string, argv: string[]) {
        console.log("initializing dist directory...");
        BuildFunc.prepareDir(currentPath);
        console.log("initialize finish.");
        let components: { [key: string]: Component } = this.loadComponent(currentPath); // TODO 続き
    }

    private static prepareDir(projectPath: string) {
        const distPath: string = path.join(projectPath, "dist");
        if (fs.existsSync(distPath)) {
            console.log("clearing dist directory...");
            fs.rmdirSync(distPath, {recursive: true});
        }
        fs.mkdirSync(distPath);
    }

    private loadComponent(projectPath: string): { [key: string]: Component } {
        const componentsPath: string = path.join(projectPath, "components");
        const getFiles: Function = (componentsPath: string, searchPath: string): string[] => {
            const allFiles: string[] = [];
            const dirElements: string[] = fs.readdirSync(searchPath);
            dirElements.forEach((el) => {
                const elPath: string = path.join(searchPath, el);
                const elStat: fs.Stats = fs.statSync(elPath);
                if (elStat.isFile()) allFiles.push(path.relative(componentsPath, elPath));
                else if (elStat.isDirectory()) {
                    const innerFiles: string[] = getFiles(componentsPath, elPath);
                    innerFiles.forEach(file => {
                        allFiles.push(file)
                    });
                }
            });
            return allFiles;
        }
        const fileList: string[] = getFiles(componentsPath, componentsPath);
        const components: { [key: string]: Component } = {}
        fileList.forEach(name => {
            const content: string = fs.readFileSync(path.join(componentsPath, name), "utf-8");
            components[name] = new Component(name, content);
        });
        return components;
    }
}

class Component {
    private name;
    public document: JSDOM;

    constructor(name: string, content: string) {
        this.name = name;
        this.document = new JSDOM(content);
    }
}
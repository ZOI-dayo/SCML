import fs from "fs";
import path from "path";
import {Func} from "../func";

export class InitFunc extends Func {
    public static _instance: InitFunc = new InitFunc();

    private constructor() {
        super("init");
    }

    override run(currentPath: string, argv: string[]): void {
        const dirMap: string[] = [
            "assets",
            "components",
            "pages",
            "static"
        ];
        for (const dirName of dirMap) {
            const dirPath: string = path.join(currentPath, dirName.replace("/", path.sep));
            if (!fs.existsSync(dirPath)) {
                console.log("creating \"" + dirName + "\" directory...");
                fs.mkdirSync(dirPath);
            } else {
                console.log("skip \"" + dirName + "\" directory...");
            }
        }
        const fileMap: { [key: string]: string } = {
            "components/MyComponent.html":
                "<header>\n" +
                "  <span>This is header</span>\n" +
                "</header>\n" +
                "<style scoped>\n" +
                "header {\n" +
                "  width: 100%;\n" +
                "  background-color: azure;\n" +
                "}\n" +
                "</style>\n",
            "pages/index.html":
                "<div>\n" +
                "  <MyComponent />\n" +
                "</div>\n",
        };
        for (const fileName in fileMap) {
            const filePath: string = path.join(currentPath, fileName.replace("/", path.sep));
            if (!fs.existsSync(filePath)) {
                console.log("creating \"" + fileName + "\" ...");
                fs.writeFileSync(filePath, fileMap[fileName], {flag: "wx"});
            } else {
                console.log("skip \"" + fileName + "\" directory...");
            }
        }
        console.log("finished.");
    }
}
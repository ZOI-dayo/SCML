import fs from "fs";
import path from "path";
import {Func} from "../func";
import {APP_LOGGER} from "../../main";

export class InitFunc extends Func {
    public static _instance: InitFunc = new InitFunc();

    private constructor() {
        super("init");
    }

    override run(currentPath: string, args: string[]): void {
        const dirMap: string[] = [
            "assets",
            "components",
            "pages",
            "static"
        ];
        for (const dirName of dirMap) {
            const dirPath: string = path.join(currentPath, dirName?.replace("/", path.sep));
            if (!fs.existsSync(dirPath)) {
                APP_LOGGER.log("creating \"" + dirName + "\" directory...");
                fs.mkdirSync(dirPath);
            } else {
                APP_LOGGER.log("skip \"" + dirName + "\" directory...");
            }
        }
        const fileMap: { [key: string]: string } = {
            "scml.json":
                "{\n" +
                "  \"plugins\": [\n" +
                "    {\n" +
                "      \"name\": \"compile_md_in_pages\",\n" +
                "      \"srcExtension\": \"md\",\n" +
                "      \"targetExtension\": \"html\",\n" +
                "      \"template\": \"assets/templates/md.html\",\n" +
                "      \"parseText\": \"<!-- mdContent -->\",\n" +
                "      \"targetText\": \"<Markdown src=\\\"#{PATH}\\\" prefix=\\\"\\\" suffix=\\\"\\\" />\"\n" +
                "    }\n" +
                "  ]\n" +
                "}\n",
            "assets/templates/md.html":
                "<!-- mdContent -->\n",
            "components/MyComponent.html":
                "<header>\n" +
                "  <span>This is header</span>\n" +
                "</header>\n" +
                "<style>\n" +
                "header {\n" +
                "  width: 100%;\n" +
                "  background-color: azure;\n" +
                "}\n" +
                "</style>\n",
            "pages/index.html":
                "<div>\n" +
                "  <MyComponent />\n" +
                "  <Markdown src=\"@/test.md\" />\n" +
                "</div>\n",
            "assets/test.md":
                "paragraph 1\n" +
                "\n" +
                "paragraph 2\n" +
                "\n" +
                "*strong*\n" +
                "**STRONG**\n" +
                "\n" +
                "`inline code`\n" +
                "```\n" +
                "block code\n" +
                "```\n" +
                "\n" +
                "- list 1\n" +
                "    - item 1\n" +
                "    - item 2\n" +
                "\n" +
                "1. list 2 (item 1)\n" +
                "2. list 2 (item 2)\n" +
                "\n" +
                "# heading 1\n" +
                "## heading 2\n" +
                "### heading 3\n" +
                "#### heading 4\n" +
                "\n" +
                "> \"blockQuote\n" +
                "you can break line\"\n" +
                "\n" +
                "---\n" +
                "\n",
        };
        for (const fileName in fileMap) {
            const filePath: string = path.join(currentPath, fileName?.replace("/", path.sep));
            if (!fs.existsSync(filePath)) {
                APP_LOGGER.log("creating \"" + fileName + "\" ...");
                fs.mkdirSync(path.dirname(filePath), {recursive: true});
                fs.writeFileSync(filePath, fileMap[fileName], {flag: "wx", encoding: "utf8"});
            } else {
                APP_LOGGER.log("skip \"" + fileName + "\" directory...");
            }
        }
        APP_LOGGER.log("finished.");
    }
}
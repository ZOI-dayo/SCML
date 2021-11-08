// noinspection BadExpressionStatementJS

export class Markdown {
    public static getName(): string {
        return "Markdown";
    }

    public static getContent(): string {
        return `
{{ prefix }}
[[ mdContent ]]
{{ suffix }}
<script scml>
(buildInfo, options) => {
    const main = require("@zoi-dayo/scml/dist/main")
    const marked = require("marked");
    const fs = require("fs");
    const path = require("path");
    const rawPath = options["src"];
    
    if(options["class"] === undefined) options["class"] = "";
    if(options["prefix"] === undefined) options["prefix"] = '<div class="' + options["class"] + ' mdContent">';
    if(options["suffix"] === undefined) options["suffix"] = '</div>';
    
    // const APP_LOGGER = main.APP_LOGGER;
    
    if(rawPath === undefined) return {};
    let assetsPath = rawPath.startsWith("@/") ? rawPath.replace("@", buildInfo.assetsDir).replace("/", path.sep) : rawPath.replace("/", path.sep);
    // if(buildInfo.hasOption("lang")) {
    //     const langPath = assetsPath.replace(".md", "_" + buildInfo.lang + ".md");
    //     if(fs.existsSync(langPath)) {
    //         assetsPath = langPath;
    //     } else {
    //         APP_LOGGER.warn("File " + langPath + " not exist, so use " + assetsPath);
    //     }
    // }
    // console.log(assetsPath);
    
    const fileContent = fs.readFileSync(assetsPath, "utf-8");
    
    marked.Renderer.prototype.paragraph = (text) => {
        if (text.trim().startsWith("<")) {
            return text;
        }
        return "<p>" + text + "</p>";
    };
    return {
        "mdContent": marked(fileContent),
    };
}
</script>
        `;
    }
}
// noinspection BadExpressionStatementJS

export class Markdown {
    public static getName(): string {
        return "Markdown";
    }

    public static getContent(): string {
        return `
<div class="{{ class }} mdContent">
[[ mdContent ]]
</div>
<script scml>
(buildInfo, options) => {
    const marked = require("marked");
    const fs = require("fs");
    const path = require("path");
    const rawPath = options["src"];
    
    if(rawPath === undefined) return {};
    let assetsPath = rawPath.startsWith("@" + path.sep) ? rawPath.replace("@" + path.sep, "") : rawPath;
    if(buildInfo.hasOption("lang")) assetsPath = assetsPath.replace(".md", "_" + buildInfo.lang + ".md");
    console.log(assetsPath);
    
    const fileContent = fs.readFileSync(path.join(buildInfo.assetsDir, assetsPath), "utf-8");
    return {
        "mdContent": marked(fileContent),
    };
}
</script>
        `;
    }
}
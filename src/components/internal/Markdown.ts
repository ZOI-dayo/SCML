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
    let staticPath = rawPath.startsWith("@" + path.sep) ? rawPath.replace("@" + path.sep, "") : rawPath;
    
    const fileContent = fs.readFileSync(path.join(buildInfo.staticDir, staticPath), "utf-8");
    return {
        "mdContent": marked(fileContent),
    };
}
</script>
        `;
    }
}
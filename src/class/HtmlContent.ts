import {Component} from "./HtmlContent/Component";
import {BuildInfo} from "../func/build/build";

// noinspection HtmlUnknownAttribute
export class HtmlContent {
    public readonly name: string;
    protected readonly document: string;
    protected compiledDocument: string;

    public constructor(name: string, content: string) {
        this.name = name;
        this.document = content;
        this.compiledDocument = this.document;
    }

    protected compile(components: Component[], buildInfo: BuildInfo, options: { [key: string]: string }): string {
        this.compiledDocument = this.document;
        let additionOption: { [key: string]: string } = {};
        this.compiledDocument = this.compiledDocument.replace(/<script scml>.*<\/script>/s, (source: string): string => {
            const docFuncSource = source
                .replace("<script scml>", "")
                .replace("</script>", "");
            const docFunc: (buildInfo: BuildInfo, options: { [key: string]: string }) => { [key: string]: string } = eval(docFuncSource) as (buildInfo: BuildInfo, options: { [key: string]: string }) => { [key: string]: string };

            additionOption = docFunc(buildInfo, options ?? {});
            return "";
        });
        if (options !== undefined) {
            for (const optionsKey in options) {
                const optionValue = options[optionsKey];
                console.log(optionsKey + " : " + optionValue);
                this.compiledDocument = this.compiledDocument.replace(new RegExp("\\{\\{ " + optionsKey + " \\}\\}", "g"), optionValue);
            }
        }
        for (const optionsKey in additionOption) {
            const optionValue = additionOption[optionsKey];
            this.compiledDocument = this.compiledDocument.replace(new RegExp("\\[\\[ " + optionsKey + " \\]\\]", "g"), optionValue);
        }
        for (const component of components) {
            const tagPattern = new RegExp("< *" + component.name + "(.*?)\\/>", "g");
            // const tagPattern = /< *MyComponent(.*?)\/>/g;
            this.compiledDocument = this.compiledDocument.replace(tagPattern, (match: string): string => {
                return HtmlContent.compileFromTag(components, buildInfo, component, match, this.name);
            });
        }
        // APP_LOGGER.error("    " + this.compiledDocument);
        return this.compiledDocument;
    }

    private static compileFromTag(components: Component[], buildInfo: BuildInfo, component: Component, tag: string, srcName: string): string {
        const options: { [key: string]: string } = {};
        const keyValueOptionPattern = new RegExp("\\S+((=\".*?\")|[^\\s\\S])", "g");
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
        if(srcName === component.name) return "";
        return component.compile(components, buildInfo, options);
    }
}
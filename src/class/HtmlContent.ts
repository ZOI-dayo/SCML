import {Component} from "./HtmlContent/Component";

export class HtmlContent {
    public readonly name: string;
    private readonly document: string;
    private compiledDocument: string;

    public constructor(name: string, content: string) {
        this.name = name;
        this.document = content;
        this.compiledDocument = this.document;
    }

    protected compile(components: { [key: string]: Component }, resolved: string[], options?: { [key: string]: string }): string {
        if (resolved.includes(this.name)) return this.document;
        resolved.push(this.name);
        this.compiledDocument = this.document;
        if (options !== undefined) {
            for (const optionsKey in options) {
                const optionValue = options[optionsKey];
                console.log(optionsKey + " : " + optionValue);
                this.compiledDocument = this.compiledDocument.replace(`{{ ${optionsKey} }}`, optionValue);
            }
        }
        let additionOption: { [key: string]: string } = {};
        this.compiledDocument = this.compiledDocument.replace(/<script scml>.*<\/script>/s, (source: string): string => {
            const docFuncSource = source
                .replace("<script scml>", "")
                .replace("</script>", "");
            const docFunc: (options: { [key: string]: string }) => { [key: string]: string } = eval(docFuncSource) as (options: { [key: string]: string }) => { [key: string]: string };
            additionOption = docFunc(options ?? {});
            return "";
        });
        for (const optionsKey in additionOption) {
            const optionValue = additionOption[optionsKey];
            console.log(optionsKey + " : " + optionValue);
            this.compiledDocument = this.compiledDocument.replace(`{{{ ${optionsKey} }}}`, optionValue);
        }
        for (const name in components) {
            const component = components[name];
            const tagPattern = new RegExp("< *" + component.name + "(.*?)\\/>", "gs");
            // const tagPattern = /< *MyComponent(.*?)\/>/g;
            this.compiledDocument = this.compiledDocument.replace(tagPattern, (match: string): string => {
                return HtmlContent.compileFromTag(components, component, match, resolved);
            });
        }
        return this.compiledDocument;
    }

    private static compileFromTag(components: { [key: string]: Component }, component: Component, tag: string, resolved: string[]): string {
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
        return component.compile(components, resolved, options);
    }
}
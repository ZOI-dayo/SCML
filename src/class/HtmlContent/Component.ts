import {HtmlContent} from "../HtmlContent";

export class Component extends HtmlContent {
    public override compile(components: { [key: string]: Component }, resolved: string[], options?: { [key: string]: string }): string {
        if (options !== null) {
            console.log(options);
        }
        return super.compile(components, resolved, options);
    }
}
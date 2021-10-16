import {HtmlContent} from "../HtmlContent";
import {BuildInfo} from "../../func/build/build";

export class Component extends HtmlContent {
    public override compile(components: { [key: string]: Component }, buildInfo: BuildInfo, resolved: string[], options: { [key: string]: string }): string {
        if (options !== null) {
            console.log(options);
        }
        return super.compile(components, buildInfo, resolved, options);
    }
}
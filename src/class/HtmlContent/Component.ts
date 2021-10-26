import {HtmlContent} from "../HtmlContent";
import {BuildInfo} from "../../func/build/build";
import {Page} from "./Page";

export class Component extends HtmlContent {
    public staticStyle = "";

    public constructor(name: string, content: string) {
        super(name, content, "component");
    }

    public override compile(components: Component[], buildInfo: BuildInfo, page: Page, options: { [key: string]: string }): string {
        // if (options !== null) {
        //     APP_LOGGER.log( JSON.stringify(options));
        // }
        return super.compile(components, buildInfo, page, options);
    }
}
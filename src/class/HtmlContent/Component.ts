import {HtmlContent} from "../HtmlContent";
import {BuildInfo} from "../../func/build/build";

export class Component extends HtmlContent {
    public override compile(components: Component[], buildInfo: BuildInfo, options: { [key: string]: string }): string {
        // if (options !== null) {
        //     APP_LOGGER.log( JSON.stringify(options));
        // }
        return super.compile(components, buildInfo, options);
    }
}
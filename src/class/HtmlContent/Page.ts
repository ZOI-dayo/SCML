import {HtmlContent} from "../HtmlContent";
import {Component} from "./Component";
import {BuildInfo} from "../../func/build/build";

export class Page extends HtmlContent {
    public compile(components: { [key: string]: Component }, buildInfo: BuildInfo): string {
        return super.compile(components,  buildInfo, [],  {});
    }
}
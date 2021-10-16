import {HtmlContent} from "../HtmlContent";
import {Component} from "./Component";

export class Page extends HtmlContent {
    public compile(components: { [key: string]: Component }): string {
        return super.compile(components, []);
    }
}
import {HtmlContent} from "../HtmlContent";
import {Component} from "./Component";
import {BuildInfo} from "../../func/build/build";

export class Page extends HtmlContent {
    private style = "";
    public compile(components: Component[], buildInfo: BuildInfo): string {
        this.style = "";
        let content = super.compile(components, buildInfo, this, {});
        if(content.search(/<\/head>/gs) < 0) {
            content = `<style>${this.style}</style>` + content;
        }else {
           content = content.replace(/<\/head>/gs, `<style>${this.style}</style></head>`);
        }
        return content;
    }
    addStyle(appendStyle: string): void {
        this.style += appendStyle;
    }
}
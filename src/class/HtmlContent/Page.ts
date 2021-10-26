import {HtmlContent} from "../HtmlContent";
import {Component} from "./Component";
import {BuildInfo} from "../../func/build/build";

export class Page extends HtmlContent {
    private pageStyle = "";
    private compStyle = "";
    private importedComponent: string[] = [];

    public constructor(name: string, content: string) {
        super(name, content, "page");
    }

    public compile(components: Component[], buildInfo: BuildInfo): string {
        let content = super.compile(components, buildInfo, this, {});
        const style = this.pageStyle + this.compStyle;
        if (content.search(/<\/head>/gs) < 0) {
            content = `<style>${style}</style>` + content;
        } else {
            content = content.replace(/<\/head>/gs, `<style>${style}</style></head>`);
        }
        return content;
    }

    public addComponentStyle(appendStyle: string): void {
        this.compStyle += appendStyle;
    }

    public setPageStyle(style: string): void {
        this.pageStyle += style;
    }

    public importContent(name: string): boolean {
        if (this.importedComponent.indexOf(name) < 0) {
            this.importedComponent.push(name);
            return true;
        }
        return false;
    }
}
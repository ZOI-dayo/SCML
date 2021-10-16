import {Component} from "../class/HtmlContent/Component";
import {Markdown} from "./internal/Markdown";

export class InternalComponentsLoader {
    public static load(): Component[] {
        const loaded: Component[] = [];
        loaded.push(new Component(Markdown.getName(), Markdown.getContent()));
        return loaded;
    }
}
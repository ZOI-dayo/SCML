export class Markdown {
    public static getName(): string {
        return "Markdown";
    }

    public static getContent(): string {
        return `
<div id="root">
</div>
<script scml>
    (options) => {
        console.log(options);
    }
</script>}
        `;
    }
}
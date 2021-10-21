import http, {IncomingMessage, ServerResponse} from "http";
import path from "path";
import fs from "fs";
import ErrnoException = NodeJS.ErrnoException;
import {Logger} from "../../main";
import {Exception} from "../../class/Exception";

export class Server {
    private readonly src: string;
    private readonly port: number;
    private server: http.Server;
    public logger: Logger;

    public constructor(src: string, port?: number) {
        this.logger = new Logger("SCML.Server");
        this.src = src;
        this.port = port ?? 8080;
        this.server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
            let filePath = path.join(this.src, req.url ?? "");
            if (filePath.endsWith("/")) {
                filePath += "index.html";
            }
            if(req.url === "") filePath += "/index.html";
            const extname = String(path.extname(filePath)).toLowerCase();
            const mimeTypes: { [key: string]: string } = {
                ".html": "text/html",
                ".js": "text/javascript",
                ".css": "text/css",
                ".png": "image/png",
                ".jpg": "image/jpg",
            };

            const contentType = mimeTypes[extname] || "application/octet-stream";

            fs.readFile(filePath, (error: ErrnoException | null, content: Buffer) => {
                if (error !== null) {
                    if (error.code === "ENOENT") {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        res.writeHead(200, {"Content-Type": contentType});
                        res.end(new NotFoundException(error.path ?? "").throwText());
                    } else {
                        res.writeHead(500);
                        res.end(new UnknownException(error.path ?? "").throwText());
                    }
                } else {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    res.writeHead(200, {"Content-Type": contentType});
                    res.end(content, "utf-8");
                }
            });
        });
        this.logger.log("Server opened : http://localhost:" + this.port.toString());
    }

    public start(): void {
        this.server.listen(this.port);
    }
    public stop(): void {
        this.server.close();
    }
}

class NotFoundException extends Exception {
    constructor(file: string) {
        super("404 not found : " + file);
    }
}

class UnknownException extends Exception {
    constructor(file: string) {
        super("unknown error at " + file);
    }
}
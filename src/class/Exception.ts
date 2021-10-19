import {APP_LOGGER} from "../main";

export class Exception {
    private readonly message: string;
    protected constructor(message: string) {
        this.message = message;
    }

    public throw(): string {
        return APP_LOGGER.error(this.message);
    }
    public throwText(): string {
        return APP_LOGGER.print(this.message);
    }
}
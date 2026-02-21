import {Command} from "@commands/BaseCommand";
import * as process from "node:process";

export class ExitCommand extends Command{
    async execute(): Promise<void> {
        process.exit(0);
    }
}
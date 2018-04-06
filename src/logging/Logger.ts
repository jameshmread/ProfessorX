import { LogTypes } from "../../enums/LogTypes";
import * as fs from "fs";

export interface ILogFormat {
    logType: string;
    timestamp: number;
    messageText: string;
    obj?: any;
}

export class Logger {

    public static logContent =  {
        info: new Array<ILogFormat>(),
        log: new Array<ILogFormat>(),
        warn: new Array<ILogFormat>(),
        fatal: new Array<ILogFormat>()
    };

    public static log (message: string, object? : any): void {
        this.logContent.log.push(
            {logType: LogTypes.log, timestamp: new Date().getTime(), messageText: message, obj: object});
    }

    public static info (message: string, object? : any): void {
        this.logContent.info.push(
            {logType: LogTypes.info, timestamp: new Date().getTime(), messageText: message, obj: object});
    }

    public static warn (message: string, object? : any): void {
        this.logContent.warn.push(
            {logType: LogTypes.warn, timestamp: new Date().getTime(), messageText: message, obj: object});
    }

    public static fatal (message: string, object? : any): void {
        this.logContent.fatal.push(
            {logType: LogTypes.fatal, timestamp: new Date().getTime(), messageText: message, obj: object});
    }

    public static dumpLogToConsole () {
        console.log(JSON.stringify(this.logContent.log));
        console.log(JSON.stringify(this.logContent.info));
        console.log(JSON.stringify(this.logContent.warn));
        console.log(JSON.stringify(this.logContent.fatal));
    }

    public static dumpLogToFile () {
        throw Error("Not implemented yet");
        fs.writeFileSync("../../LOG.json", JSON.stringify(this.logContent));
    }
}

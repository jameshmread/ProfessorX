import { LogLevels } from "../../enums/LogLevels";
import { LogTypes } from "../../enums/LogTypes";
import * as fs from "fs";

export interface ILogLevel {
    console: boolean;
    json: boolean;
}

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

    private static outputToConsole: boolean;
    private static outputToJSON: boolean;

    public static setLogLevel (level: string) {
        if (level === LogLevels.verbose) {
            this.outputToConsole = true;
            this.outputToJSON = true;
        } else if (level === LogLevels.JSON) {
            this.outputToJSON = true;
        } else if (level === LogLevels.console) {
            this.outputToConsole = true;
        } else if (level === LogLevels.none) {
            this.outputToConsole = false;
            this.outputToJSON = false;
        }
    }

    public static setLogLevelNone () {
        this.outputToConsole = false;
        this.outputToJSON = false;
    }

    public static setLogLevelVerbose () {
        this.outputToConsole = true;
        this.outputToJSON = true;
    }

    public static getLogLevel (): ILogLevel {
        return {console: this.outputToConsole, json: this.outputToJSON};
    }

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
        console.log(JSON.stringify(this.logContent.fatal));
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

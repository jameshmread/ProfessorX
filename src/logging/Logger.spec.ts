import { expect } from "chai";
import { Logger } from "./Logger";
import { LogLevels } from "../../enums/LogLevels";

describe("Logger", () => {
    let logger: Logger;

    beforeEach(() => {
        logger = new Logger();
        Logger.setLogLevelNone();
    });

    it("should set json and console output to false with none level", () => {
        Logger.setLogLevel(LogLevels.none);
        expect(Logger.getLogLevel()).to.eql({console: false, json: false});
    });

    it("should set json true console output to false with json level", () => {
        Logger.setLogLevel(LogLevels.JSON);
        expect(Logger.getLogLevel()).to.eql({console: false, json: true});
    });

    it("should set json false console output to true with console level", () => {
        Logger.setLogLevel(LogLevels.console);
        expect(Logger.getLogLevel()).to.eql({console: true, json: false});
    });

    it("should set json true console output to true with verbose level", () => {
        Logger.setLogLevel(LogLevels.verbose);
        expect(Logger.getLogLevel()).to.eql({console: true, json: true});
    });
});

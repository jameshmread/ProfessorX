import { expect } from "chai";
import * as Mocha from "mocha";

import { ConfigManager } from "./ConfigManager";

describe("Config manager", () => {
    let config: ConfigManager;
    beforeEach(() => {
         config = new ConfigManager();
    });

    it("config should not be null", () => {
        expect(config.config).to.not.equal(void 0);
    });

    it("should be true for a standard config", () => {
        expect(config.configValid()).to.equal(true);
    });

    xit("should throw error with one null field", () => {
        config.fileToMutate = null;
        expect(() => {
            config.configValid();
        }).to.throw(Error);
    });
});

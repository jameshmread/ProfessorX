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

    it("should not throw error for a standard config", () => {
        expect(() => {
            config.configValid();
        }).not.to.throw(Error);
    });

    it("should throw error if no configuration is given", () => {
        config.config = null;
        expect(() => {
            config.configValid();
        }).to.throw(Error);
    });
});

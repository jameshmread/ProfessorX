import { expect } from "chai";
import * as Mocha from "mocha";

import { ConfigManager } from "./ConfigManager";

describe("Config manager", () => {
    const config = new ConfigManager();
    it("config should not be null", () => {
        expect(config.config).to.not.equal(void 0);
    });
});

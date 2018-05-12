import { expect } from "chai";

import { EndResult } from "../../../DTOs/EndResult";
import { OutputFormats } from "../../../enums/OutputFormats";
import { StubConfigFile } from "../../../testUtilities/StubConfigFile";

import { OutputController } from "./OutputController";
import { ConfigManager } from "../../configManager/ConfigManager";

describe("Output controller", () => {
      let outputController: OutputController;
      const endResult = new EndResult("", {}, null, null, null, null);
      beforeEach(() => {
            outputController = new OutputController(endResult);
      });

      it(`should be defined`, () => {
            expect(outputController).to.not.equal(void 0);
      });

      it("should create an output format of console", () => {
            expect(outputController.outputFormat).to.equal(OutputFormats.console + "," + OutputFormats.app);
      });
});

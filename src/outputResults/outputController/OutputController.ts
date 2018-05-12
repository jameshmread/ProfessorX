import { ConfigManager } from "../../configManager/ConfigManager";
import { OutputFormats } from "../../../enums/OutputFormats";
import { EndResult } from "../../../DTOs/EndResult";

import { OutputToConsole } from "../OutputToConsole";
import { OutputToJSON } from "../OutputToJSON";

export class OutputController {

      public outputFormat = "console";

      constructor (private endResults: EndResult) {
            this.setOutputMethod();
      }

      public outputResults () {
            if (this.outputFormat.includes(OutputFormats.console)) {
                  OutputToConsole.printResults(this.endResults);
            }
            if (this.outputFormat.includes(OutputFormats.app)) {
                  OutputToJSON.writeResults(this.endResults);
            }
      }

      private setOutputMethod () {
            this.outputFormat = ConfigManager.outputFormat.toString();
      }
}

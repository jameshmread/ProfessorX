import * as JSONStream from "JSONStream";
import * as fs from "fs";

import { EndResult } from "../../DTOs/EndResult";
import { MathFunctions } from "../maths/MathFunctions";
import { Logger } from "../logging/Logger";

export class OutputToJSON {
      public static writeResults (collatedResults: EndResult) {
            const header = {
                runner: collatedResults.runner,
                config: collatedResults.runnerConf,
                duration: collatedResults.duration
            };
            const results = collatedResults.results;
            const transformStream = JSONStream.stringify();
            const outputFilePath = "./MutationResults.json";
            Logger.log("Results File Path", outputFilePath);
            const outputStream = fs.createWriteStream(outputFilePath);
            transformStream.pipe(outputStream);

            transformStream.write(header);
            MathFunctions.divideItemsAmongArrays(results,
                Math.floor(results.length / (results.length / 4))
            ).forEach((result) => {
                transformStream.write(result);
                Logger.info("Length of Division", result.length);
            });

            transformStream.end();
            outputStream.on("finish", () => {Logger.log("Results Written to Disk"); });
        }
}

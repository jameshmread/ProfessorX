import * as JSONStream from "JSONStream";
import * as fs from "fs";

import { EndResult } from "../../DTOs/EndResult";
import { MathFunctions } from "../maths/MathFunctions";

export class OutputToJSON {
      public static writeResults (collatedResults: EndResult) {
            const header = {
                runner: collatedResults.runner,
                config: collatedResults.runnerConf,
                duration: collatedResults.duration
            };
            const results = collatedResults.results;
            const transformStream = JSONStream.stringify();
            const outputStream = fs.createWriteStream("./MutationResults.json");

            transformStream.pipe(outputStream);

            transformStream.write(header);
            MathFunctions.divideItemsAmongArrays(results,
                Math.floor(results.length / 20)
            ).forEach((result) => {
                transformStream.write(result);
            });

            transformStream.end();
            outputStream.on("finish", () => {console.log("Results Written to Disk"); });
        }
}

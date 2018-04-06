import * as JSONStream from "JSONStream";
import * as fs from "fs";

import { EndResult } from "../../DTOs/EndResult";
import { MathFunctions } from "../maths/MathFunctions";
import { Logger } from "../logging/Logger";
import { ConfigManager } from "../configManager/ConfigManager";

export class OutputToJSON {
    public static outputfilePath: string;

    public static writeResults (collatedResults: EndResult) {
        console.log("Writing results");
        this.getOutFilePath();
        const header = {
            runner: collatedResults.runner,
            config: collatedResults.runnerConf,
            duration: collatedResults.duration,
            scoresPerFile: collatedResults.mutationScoresPerFile,
            overallScores: collatedResults.overallScores
        };
        const results = collatedResults.results;
        const transformStream = JSONStream.stringify();
        const outputStream = fs.createWriteStream(OutputToJSON.outputfilePath);
        Logger.log("Results File Path", OutputToJSON.outputfilePath);
        transformStream.pipe(outputStream);

        transformStream.write(header);
        MathFunctions.divideItemsAmongArrays(results,
            Math.floor(results.length / (results.length / 4))
        ).forEach((result) => {
            transformStream.write(result);
            Logger.info("Length of Division", result.length);
        });

        transformStream.end();
        outputStream.on("finish", () => {Logger.log("Results Written to Disk"); console.log("Results written"); });
    }

    private static getOutFilePath () {
        const rootName = ConfigManager.filePath.split("/")[1];
        OutputToJSON.outputfilePath = "./mutationResults/" + rootName + "_" +
        new Date().getDay() + "_" + new Date().getMonth() + "_" + new Date().getFullYear() + "_" +
        new Date().getUTCHours() + "-" + new Date().getUTCMinutes() + "-" + new Date().getUTCSeconds() +
        ".json".toString();
        return OutputToJSON.outputfilePath;
    }
}

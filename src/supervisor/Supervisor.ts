import { ChildProcess } from "child_process";
import * as worker from "child_process";
import * as os from "os";

import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { EndResult } from "../../DTOs/EndResult";

import { MutationResultManager } from "../mutationResultManager/MutationResultManager";
import { ConfigManager } from "../configManager/ConfigManager";
import { Cleaner } from "../cleanup/Cleaner";
import { MathFunctions } from "../maths/MathFunctions";
import { OutputToJSON } from "../outputResults/OutputToJSON";
import { Logger } from "../logging/Logger";
import { IMutationResult } from "../../interfaces/IMutationResult";
import { basename } from "path";
import { IMutationScoresPerFile } from "../../interfaces/IMutationScoresPerFile";

process.on("SIGINT", () => {
      Logger.fatal("User Pressed Ctrl + C: SIGINT Caught. Program ending.");
      Logger.log("Deleting Generated Files");
      Logger.fatal("User ended program");
      Cleaner.cleanRemainingFiles();
});

export class Supervisor {

      public startTimestamp: number;
      public logicalCores: number;
      public workers: Array<ChildProcess> = new Array<ChildProcess>();
      public splitNodes: Array<Array<IMutatableNode>>;
      public threadResults: Array<IMutationResult> = [];
      public individualFileResults: IMutationScoresPerFile;

      constructor (private inputNodes: Array<IMutatableNode>) {
            this.logicalCores = os.cpus().length;
            this.startTimestamp = new Date().getTime();
            Logger.log("Splitting nodes among workers");
            this.splitNodes = MathFunctions.divideItemsAmongArrays(inputNodes, this.logicalCores);
      }

      public spawnWorkers () {
            for (let i = 0; i < this.logicalCores; i++) {
                  this.workers.push(worker.fork("./src/Worker.ts", [], {}));
                  Logger.info("Creating Worker: ", i);
                  this.createWorkerMessagers(this.workers[i]);
                  this.workers[i].send(JSON.stringify(this.splitNodes[i]));
            }
      }

      public getIndividualFileResults () {
            const filesMutated: IMutationScoresPerFile = {
                  files: ConfigManager.filesToMutate,
                  mutantsSurvivedForEach: [],
                  totalMutationsForEach: []
            };
            filesMutated.files.forEach((file) => {
                  filesMutated.mutantsSurvivedForEach.push(0);
                  filesMutated.totalMutationsForEach.push(0);
            });

            this.threadResults.forEach((item, index) => {
                  console.log("Completing Summary: " +
                  MathFunctions.calculatePercentage(index, this.threadResults.length) + " %");
                  const indexOfSRCFile = ConfigManager.filesToMutate.indexOf(item.SRC_FILE);
                  if (indexOfSRCFile >= 0) {
                        filesMutated.totalMutationsForEach[indexOfSRCFile] ++;
                  }
                  if (item.mutatedCode !== null) {
                        filesMutated.mutantsSurvivedForEach[indexOfSRCFile] ++;
                  }
            });
            return filesMutated;
      }

      public getOverallMutationScore () {
            const mutationsPerformed = this.individualFileResults.totalMutationsForEach
                  .reduce((accumulator, current) => accumulator += current);
            console.log("mutationsPerformed", mutationsPerformed);
            const survivingMutants = this.individualFileResults.mutantsSurvivedForEach
            .reduce((accumulator, current) => accumulator += current);
            console.log("surviving mutants", survivingMutants);
            const numberOfKilledOrErrored = mutationsPerformed - survivingMutants;
            console.log("killed OR errored", numberOfKilledOrErrored);
            return {
                  totalKilledMutants: numberOfKilledOrErrored,
                  totalSurvivingMutants: survivingMutants,
                  mutationScore: MathFunctions.calculatePercentage(
                        numberOfKilledOrErrored, mutationsPerformed)
            };
      }

      private createWorkerMessagers (individualWorker: ChildProcess) {
            individualWorker.on("error", (err) => {
                  Logger.fatal("Worker Error: ", err);
            });
            individualWorker.on("exit", (exit) => {
                  Logger.info("Worker Exit: ", exit);
            });
            individualWorker.on("message", (data) => {
                  this.collateResults(data);
                  Logger.info("Worker Complete", individualWorker.pid);
                  individualWorker.kill();
                  Logger.info("Worker Killed", individualWorker.pid);
            });
      }

      private collateResults (data) {
            this.threadResults.push(data);
            if (this.threadResults.length >= this.logicalCores) {
                  Logger.log("All workers complete");
                  this.threadResults = [].concat.apply([], this.threadResults);
                  this.finishRun();
                  return;
            }
      }

      private finishRun () {
            const endTimestamp = new Date().getTime();
            const timeTaken = MathFunctions.calculateRunTime(
                   new Date(endTimestamp - this.startTimestamp).getTime()
            );
            Logger.info("Mutations Complete in: ", timeTaken);
            Logger.info("Number of mutations produced: ", this.threadResults.length);
            console.log("Creating End Result");
            this.individualFileResults = this.getIndividualFileResults();
            const endResult = new EndResult(
                  ConfigManager.testRunner,
                  ConfigManager.runnerConfig,
                  timeTaken,
                  this.individualFileResults,
                  this.getOverallMutationScore(),
                  this.threadResults
            );
            // Logger.dumpLogToConsole();
            console.log("");
            console.log("end result", endResult.overallScores);
            console.log("Writing results");
            OutputToJSON.writeResults(endResult);
            console.log("Results written");
            Cleaner.cleanRemainingFiles();
      }
}

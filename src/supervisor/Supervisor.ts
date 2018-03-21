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
            const indFileResults = this.threadResults.map((result) => {
                  return {
                        fileName: result.SRC_FILE,
                        totalSurvivingMutants: this.threadResults.filter((resultFilter) =>
                              resultFilter.SRC_FILE === result.SRC_FILE).length,
                        allGeneratedMutationsForFile: this.inputNodes.filter((inputNodes) => {
                              return inputNodes.parentFilePath === result.SRC_FILE_PATH;
                        }).length
                  };
            });
            return indFileResults.filter((item, index, array) =>
            index === array.findIndex((el) => el.fileName === item.fileName));
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

            const endResult = new EndResult(
                  ConfigManager.testRunner,
                  ConfigManager.runnerConfig,
                  timeTaken,
                  this.getIndividualFileResults(),
                  this.getOverallMutationScore(),
                  this.threadResults
            );
            Logger.dumpLogToConsole();
            console.log("");
            console.log("end result", endResult.fileList);
            OutputToJSON.writeResults(endResult);
            Cleaner.cleanRemainingFiles();
      }

      private getOverallMutationScore () {
            const mutationsPerformed = this.inputNodes.length;
            const survivingMutants = this.threadResults.length;
            const numberOfKilledOrErrored = mutationsPerformed - survivingMutants;
            return {
                  totalKilledMutants: numberOfKilledOrErrored,
                  totalSurvivingMutants: survivingMutants,
                  mutationScore: this.calculateMutationScore(
                        numberOfKilledOrErrored, mutationsPerformed)
            };
      }

      private calculateMutationScore (killed: number, total: number): number {
            return Number((killed / total * 100).toFixed(2));
      }
}

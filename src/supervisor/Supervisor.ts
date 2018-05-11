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
import { IMutationScoresPerFile } from "../../interfaces/IMutationScoresPerFile";
import { ProgressDisplay } from "../progressDisplay/ProgressDisplay";
import { MutationFactory } from "../mutationFactory/MutationFactory";
import { IDurationFormat } from "../../interfaces/IDurationFormat";
import { OutputToConsole } from "../outputResults/OutputToConsole";

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
      public progressDisplay: ProgressDisplay;

      public timeTaken: IDurationFormat;

      constructor (private inputNodes: Array<IMutatableNode>) {
            this.createMutationProgressBar();
            this.logicalCores = os.cpus().length;
            this.startTimestamp = new Date().getTime();
            Logger.log("Splitting nodes among workers");
            this.splitNodes = MathFunctions.divideItemsAmongArrays(inputNodes, this.logicalCores);
            if (this.splitNodes.length < this.logicalCores) {
                  this.logicalCores = this.splitNodes.length;
            }
      }

      public spawnWorkers () {
            for (let i = 0; i < this.logicalCores; i++) {
                  this.workers.push(worker.fork("./src/Worker.ts", [], {
                        // ts claims this is invalid but it is correct
                        stdio: ["ipc", "ignore", "ignore"] }));
                  Logger.info("Creating Worker: ", i);
                  this.createWorkerMessagers(this.workers[i]);
                  this.workers[i].send(JSON.stringify(this.splitNodes[i]));
            }
      }

      public getIndividualFileResults () {
            this.progressDisplay.summaryProgressBar = this.progressDisplay.createProgressBar(
                  "Generating Summary:              |:bar| :percent | Time Elapsed :elapsed",
            this.threadResults.length);

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
                  const indexOfSRCFile = ConfigManager.filesToMutate.indexOf(item.SRC_FILE);
                  if (indexOfSRCFile >= 0) {
                        filesMutated.totalMutationsForEach[indexOfSRCFile] ++;
                  }
                  if (item.mutatedCode !== null) {
                        filesMutated.mutantsSurvivedForEach[indexOfSRCFile] ++;
                  }
                  this.progressDisplay.tickBar(this.progressDisplay.summaryProgressBar);
            });
            return filesMutated;
      }

      public getOverallMutationScore () {
            const mutationsPerformed = this.individualFileResults.totalMutationsForEach
                  .reduce((accumulator, current) => accumulator += current);
            const survivingMutants = this.individualFileResults.mutantsSurvivedForEach
            .reduce((accumulator, current) => accumulator += current);
            const numberOfKilledOrErrored = mutationsPerformed - survivingMutants;
            return {
                  totalKilledMutants: numberOfKilledOrErrored,
                  totalSurvivingMutants: survivingMutants,
                  mutationScore: MathFunctions.calculatePercentage(
                        numberOfKilledOrErrored, mutationsPerformed)
            };
      }

      public finishRun () {
            this.timeTaken = this.getRunDuration();
            Logger.info("Number of mutations produced: ", this.threadResults.length);
            console.log("Creating End Result");
            this.individualFileResults = this.getIndividualFileResults();
            const endResult = new EndResult(
                  ConfigManager.testRunner,
                  ConfigManager.runnerConfig,
                  this.timeTaken,
                  this.individualFileResults,
                  this.getOverallMutationScore(),
                  this.threadResults
            );
            return endResult;
      }

      private createWorkerMessagers (individualWorker: ChildProcess) {
            individualWorker.on("error", (err) => {
                  Logger.fatal("Worker Error: ", err);
            });
            individualWorker.on("exit", (exit) => {
                  Logger.info("Worker Exit: ", exit);
            });
            individualWorker.on("message", (data) => {
                  if (data === "tick") {
                        this.progressDisplay.tickBar(this.progressDisplay.mutationProgressBar);
                  } else {
                        this.collateResults(data);
                        Logger.info("Worker Complete", individualWorker.pid);
                        individualWorker.kill();
                        Logger.info("Worker Killed", individualWorker.pid);
                  }
            });
      }

      private collateResults (data) {
            this.threadResults.push(data);
            if (this.threadResults.length >= this.logicalCores) {
                  Logger.log("All workers complete");
                  this.threadResults = [].concat.apply([], this.threadResults);
                  const endResult = this.finishRun();
                  OutputToJSON.writeResults(endResult);
                  Cleaner.cleanRemainingFiles();
                  return;
            }
      }

      private createMutationProgressBar () {
            this.progressDisplay = new ProgressDisplay();
            this.progressDisplay.mutationProgressBar = this.progressDisplay.createProgressBar(
                  "Generating and Executing Mutants |:bar| :percent | Time elapsed :elapsed",
                  MutationFactory.getTotalNumberOfMutations(this.inputNodes));
      }

      private getRunDuration (): IDurationFormat {
            const endTimestamp = new Date().getTime();
            const timeTaken = MathFunctions.calculateRunTime(
                   new Date(endTimestamp - this.startTimestamp).getTime()
            );
            Logger.info("Mutations Complete in: ", timeTaken);
            return timeTaken;
      }
}

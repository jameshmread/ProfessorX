import { ChildProcess } from "child_process";
import * as worker from "child_process";
import * as os from "os";

import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { EndResult } from "../../DTOs/EndResult";

import { OutputStoreManager } from "../output/OutputStoreManager";
import { ConfigManager } from "../configManager/ConfigManager";
import { Cleaner } from "../cleanup/Cleaner";

process.on("SIGINT", () => {
      console.log("SIGINT Caught. Program ending. \n");
      console.log("Deleting Files \n");
      Cleaner.cleanRemainingFiles();
});

export class Supervisor {

      public startTimestamp: number;
      public logicalCores: number;
      public workers: Array<ChildProcess> = new Array<ChildProcess>();
      public nodes: Array<Array<IMutatableNode>>;
      public threadResults = [];

      constructor (nodes: Array<IMutatableNode>) {
            this.logicalCores = os.cpus().length;
            this.startTimestamp = new Date().getTime();
            console.log("Splitting nodes among workers \n");
            this.nodes = this.splitNodes(nodes);
      }

      public splitNodes (inputNodes: Array<IMutatableNode>): Array<Array<IMutatableNode>> {
            const splitNodes = new Array<Array<IMutatableNode>>();
            for (let i = 0; i < inputNodes.length; i++) {
                  if (splitNodes[i] === void 0 && i < this.logicalCores) {
                        splitNodes[i % this.logicalCores] = [];
                  }
                  splitNodes[i % this.logicalCores].push(inputNodes[i]);
            }
            return splitNodes;
      }

      public spawnWorkers () {
            for (let i = 0; i < this.logicalCores; i++) {
                  this.workers.push(worker.fork("./src/Worker.ts", [], {}));
                  console.log("Creating Worker: ", i);
                  this.createWorkerMessagers(this.workers[i]);
                  this.workers[i].send(JSON.stringify(this.nodes[i]));
            }
      }

      private  createWorkerMessagers (individualWorker: ChildProcess) {
            individualWorker.on("error", (err) => {
                  console.log("Worker Error: ", err);
            });
            individualWorker.on("exit", (exit) => {
                  console.log("Worker Exit: ", exit);
            });
            individualWorker.on("message", (data) => {
                  this.collateResults(data);
                  console.log("\n Worker: ", individualWorker.pid, "Compelete \n");
                  individualWorker.kill();
            });
      }

      private collateResults (data) {
            this.threadResults.push(data);
            if (this.threadResults.length >= this.logicalCores) {
                  console.log("All workers complete");
                  this.threadResults = [].concat.apply([], this.threadResults);
                  this.finishRun();
                  return;
            }
      }

      private finishRun () {
            const endTimestamp = new Date().getTime();
            const timeTaken = OutputStoreManager.calculateRunTime(
                   new Date(endTimestamp - this.startTimestamp).getTime()
            );
            console.log("Mutations Complete in: ", timeTaken);
            console.log("Number of mutations produced: ", this.threadResults.length);

            const endResult = new EndResult(
                  ConfigManager.testRunner,
                  ConfigManager.runnerConfig,
                  this.threadResults
            );
            OutputStoreManager.writeOutputStoreToJson(endResult);
            OutputStoreManager.writeDataToJson(timeTaken);
            Cleaner.cleanRemainingFiles();
        }
}

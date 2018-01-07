import { ChildProcess } from "child_process";
import * as worker from "child_process";
import * as os from "os";

import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { OutputStoreManager } from "../output/OutputStoreManager";
import { EndResult } from "../../DTOs/EndResult";
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

    // splits nodes evenly among logical cpu cores
      public splitNodes (inputNodes: Array<IMutatableNode>): Array<Array<IMutatableNode>> {
            const splitNodes: Array<Array<IMutatableNode>> = [];
            let coreChosen = 0;
            const tempNodes = inputNodes;
            for (let i = 0; i < this.logicalCores; i++) {
                  splitNodes.push([]);
            }
            for (let i = 0; i < tempNodes.length; i++) {
                  if (coreChosen >= splitNodes.length) {
                        coreChosen = 0;
                  }
                  splitNodes[coreChosen].push(tempNodes[i]);
                  coreChosen++;
            }
            console.log("Nodes Split: ", splitNodes[0].length);
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
            const difference = OutputStoreManager.calculateRunTime(
                   new Date(endTimestamp - this.startTimestamp).getTime()
            );
            console.log("Mutations Complete in: ", difference);
            const endResult = new EndResult(
                  ConfigManager.testRunner,
                  ConfigManager.runnerConfig,
                  this.threadResults
            );
            OutputStoreManager.writeOutputStoreToJson(endResult);
            OutputStoreManager.writeDataToJson(difference);
            Cleaner.cleanRemainingFiles();
        }
}

import * as worker from "child_process";
import * as os from "os";

import { IMutatableNode } from "../interfaces/IMutatableNode";
import { OutputStoreManager } from "./output/OutputStoreManager";
import { EndResult } from "../DTOs/EndResult";
import { ConfigManager } from "./configManager/ConfigManager";
import { Cleaner } from "./cleanup/Cleaner";

process.on("SIGINT", () => {
      console.log("SIGINT Caught. Program ending. \n");
      console.log("Deleting Files \n");
      Cleaner.cleanRemainingFiles();
});

export class Supervisor {
      public static startTimestamp: number;

      public static readonly logicalCores: number = os.cpus().length;
      public static workers = [];
      public static nodes: Array<IMutatableNode>;

      public static threadResults = [];


      constructor (nodes: Array<IMutatableNode>) {
            Supervisor.startTimestamp = new Date().getTime();

            Supervisor.nodes = nodes;
            console.log("Splitting nodes among workers \n");
            Supervisor.nodes = Supervisor.splitNodes();
            Supervisor.spawnWorkers();
      }

    // splits nodes evenly among logical cpu cores
      private static splitNodes (): Array<IMutatableNode> {
            const splitNodes = [];
            let coreChosen = 0;
            const tempNodes = Supervisor.nodes;
            for (let i = 0; i < Supervisor.logicalCores; i++) {
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

      private static spawnWorkers () {
            for (let i = 0; i < Supervisor.logicalCores; i++) {
                  Supervisor.workers.push(worker.fork("./src/Worker.ts", [], {}));
                  console.log("Creating Worker: ", i);
                  Supervisor.workers[i].on("close", (close, err) => {
                        console.log("Worker Closed: ", [close, err]);
                  });
                  Supervisor.workers[i].on("error", (err) => {
                        console.log("Worker Error: ", err);
                  });
                  Supervisor.workers[i].on("exit", (exit) => {
                        console.log("Worker Exit: ", exit);
                  });
                  Supervisor.workers[i].on("message", (data) => {
                        Supervisor.collateResults(data);
                        Supervisor.workers[i].kill();
                  });
                  Supervisor.workers[i].send(JSON.stringify(Supervisor.nodes[i]));
            }
      }

      private static collateResults (data) {
            this.threadResults.push(data);
            console.log("\n Worker Complete \n");
            if (this.threadResults.length >= Supervisor.logicalCores) {
                  console.log("All workers complete");
                  this.threadResults = [].concat.apply([], this.threadResults);
                  Supervisor.finishRun();
                  return;
            }
      }

      private static finishRun () {
            const endTimestamp = new Date().getTime();
            const difference = OutputStoreManager.calculateRunTime(
                   new Date(endTimestamp - this.startTimestamp).getTime()
            );
            console.log("Mutations Complete in: ", difference);
            const endResult = new EndResult(
                  ConfigManager.testRunner,
                  ConfigManager.runnerConfig,
                  Supervisor.threadResults
            );
            OutputStoreManager.writeOutputStoreToJson(endResult);
            OutputStoreManager.writeDataToJson(difference);
            Cleaner.cleanRemainingFiles();
        }
}

import * as worker from "child_process";
import * as os from "os";

import { IMutatableNode } from "../interfaces/IMutatableNode";
import { OutputStoreManager } from "./output/OutputStoreManager";

export class Supervisor {
      public static startTimestamp: number;

      public static readonly logicalCores: number = os.cpus().length;
      public static workers = [];
      public static nodes: Array<IMutatableNode>;

      public static threadResults = [];


      constructor (nodes: Array<IMutatableNode>) {
            Supervisor.startTimestamp = new Date().getTime();

            Supervisor.nodes = nodes;
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
            return splitNodes;
      }

      private static spawnWorkers () {
            for (let i = 0; i < Supervisor.logicalCores; i++) {
                  Supervisor.workers.push(worker.fork("./src/Worker.ts"));
                  Supervisor.workers[i].addListener("message", () => {});
                  Supervisor.workers[i].on("message", (data) => {
                        Supervisor.collateResults(data);
                  });
                  Supervisor.workers[i].send(JSON.stringify(Supervisor.nodes[i]));
            }
      }

      private static collateResults (data) {
            this.threadResults.push(data);
            if (this.threadResults.length >= Supervisor.logicalCores) {
                  Supervisor.finishRun();
                  return;
            }
      }

      private static finishRun () {
            console.log("FINISH RUN--------------------------------");
            const endTimestamp = new Date().getTime();
            const difference = new Date(endTimestamp - this.startTimestamp).getTime();
            OutputStoreManager.writeOutputStoreToJson(Supervisor.threadResults);
            OutputStoreManager.setRunTime(difference);
        }
}

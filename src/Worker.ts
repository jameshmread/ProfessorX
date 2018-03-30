process.on("message", (input) => {
      const worker = new Worker(JSON.parse(input));
      worker.execute();
});

process.on("exit", () => {
      process.send(Worker.workerResults);
      process.exit(0);
});

process.on("SIGINT", () => {
      Logger.fatal("User Pressed Ctrl + C: SIGINT Caught by worker. Sending supervisor completed mutation results");
      Logger.log("Sending files to supervisor");
      Logger.fatal("User ended program");
      Worker.sendResults();
      process.exit(0);
});

import { MultipleNodeMutator } from "./multipleNodeMutator/MultipleNodeMutator";
import { Logger } from "./logging/Logger";
import { IMutatableNode } from "../interfaces/IMutatableNode";

export class Worker {
      public static workerResults = [];

      public multiNodeMutator: MultipleNodeMutator;

      constructor (public nodesToMutate: Array<IMutatableNode>) {
            this.multiNodeMutator = new MultipleNodeMutator();
      }

      public static sendResults () {
            Worker.workerResults = [].concat.apply([], Worker.workerResults);
            process.send(Worker.workerResults);
      }

      public static tick () {
            process.send("tick");
      }

      public async execute () {
            await this.mutateAllNodes();
            Worker.sendResults();
      }


      private async mutateAllNodes () {
            for (const currentNode of this.nodesToMutate) {
                  this.multiNodeMutator.setCurrentNode(currentNode);
                  await this.multiNodeMutator.mutateSingleNode();
            }
      }
}

process.on("message", (input) => {
      const worker = new Worker(JSON.parse(input));
      worker.execute();
});

import { MultipleNodeHandler } from "./multipleNodeHandler/MultipleNodeHandler";

export class Worker {
      public static workerResults = [];

      public multiNodeHandler: MultipleNodeHandler;
      public nodes;

      constructor (nodesToMutate) {
            this.nodes = nodesToMutate;
            this.multiNodeHandler = new MultipleNodeHandler();
      }

      public async execute () {
            await this.mutateAllNodes();
            Worker.workerResults = [].concat.apply([], Worker.workerResults);
            process.send(Worker.workerResults);
      }

      private async mutateAllNodes () {
            for (const currentNode of this.nodes) {
                await this.multiNodeHandler.mutateSingleNode(currentNode);
            }
      }
}

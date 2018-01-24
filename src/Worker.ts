process.on("message", (input) => {
      const worker = new Worker(JSON.parse(input));
      worker.execute();
});

import { MultipleNodeMutator } from "./multipleNodeMutator/MultipleNodeMutator";

export class Worker {
      public static workerResults = [];

      public multiNodeHandler: MultipleNodeMutator;

      constructor (public nodesToMutate) {
            this.multiNodeHandler = new MultipleNodeMutator();
      }

      public async execute () {
            await this.mutateAllNodes();
            Worker.workerResults = [].concat.apply([], Worker.workerResults);
            process.send(Worker.workerResults);
      }

      private async mutateAllNodes () {
            for (const currentNode of this.nodesToMutate) {
                  this.multiNodeHandler.setCurrentNode(currentNode);
                  await this.multiNodeHandler.mutateSingleNode();
            }
      }
}

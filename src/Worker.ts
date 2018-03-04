process.on("message", (input) => {
      const worker = new Worker(JSON.parse(input));
      worker.execute();
});

process.on("exit", () => {
      process.send(Worker.workerResults);
      process.exit(0);
});

import { MultipleNodeMutator } from "./multipleNodeMutator/MultipleNodeMutator";

export class Worker {
      public static workerResults = [];

      public multiNodeMutator: MultipleNodeMutator;

      constructor (public nodesToMutate) {
            this.multiNodeMutator = new MultipleNodeMutator();
      }

      public async execute () {
            await this.mutateAllNodes();
            Worker.workerResults = [].concat.apply([], Worker.workerResults);
            process.send(Worker.workerResults);
      }

      private async mutateAllNodes () {
            for (const currentNode of this.nodesToMutate) {
                  this.multiNodeMutator.setCurrentNode(currentNode);
                  await this.multiNodeMutator.mutateSingleNode();
            }
      }
}

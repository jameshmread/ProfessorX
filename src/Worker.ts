process.on("message", (input) => {
      const worker = new Worker(JSON.parse(input));
      worker.execute();
});

import { Supervisor } from "./Supervisor";
import { MultipleNodeHandler } from "./multipleNodeHandler/MultipleNodeHandler";
import { FileObject } from "../DTOs/FileObject";
import { SourceObject } from "../DTOs/SourceObject";
import { ConfigManager } from "./configManager/ConfigManager";
import { FileHandler } from "./FileHandler/FileHandler";
import { OutputStore } from "../DTOs/OutputStore";

export class Worker {
      public static workerResults = [];

      public multiNodeHandler: MultipleNodeHandler;
      public nodes;
      public fileHandler: FileHandler;

      public sourceObj: SourceObject;
      public fileObj: FileObject;


      constructor (nodesToMutate) {
            this.nodes = nodesToMutate;
            const configManager = new ConfigManager();
            this.fileObj = new FileObject(ConfigManager.filePath, ConfigManager.fileToMutate);
            this.fileObj.coreNumber = Number(process.pid);
            this.fileHandler = new FileHandler(this.fileObj);
            this.sourceObj = new SourceObject(this.fileHandler.getSourceObject());
            this.multiNodeHandler = new MultipleNodeHandler(this.sourceObj, this.fileObj);
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

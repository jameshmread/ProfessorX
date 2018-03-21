import { IMutatableNode } from "../interfaces/IMutatableNode";
import { MutatableNode } from "../DTOs/MutatableNode";
export class CreateMutatableNodes {

      public static filename = "filename.ts";
      public static filePath = "C:/filePath/filename.ts";
      public static testPath = "C:filePath/test/filename.spec.ts";
      public static plainText = "const x = 1;";
      public static createMutatableNodes (numberOfNodes: Number): Array<IMutatableNode> {
            const nodes: Array<IMutatableNode> = [];
            for (let i = 0; i < numberOfNodes; i++) {
                  nodes.push(new MutatableNode(
                        i,
                        { pos: i, end: i + 1 },
                        this.filename,
                        this.filePath,
                        this.testPath,
                        this.plainText
                  ));
            }
            return nodes;
      }
}

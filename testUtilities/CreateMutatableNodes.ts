import { IMutatableNode } from "../interfaces/IMutatableNode";
import { MutatableNode } from "../DTOs/MutatableNode";
export class CreateMutatableNodes {

      public static createMutatableNodes (numberOfNodes: Number): Array<IMutatableNode> {
            const nodes: Array<IMutatableNode> = [];
            for (let i = 0; i < numberOfNodes; i++) {
                  nodes.push(new MutatableNode(i * 2, { pos: i, end: i + 1 }, ""));
            }
            return nodes;
      }
}

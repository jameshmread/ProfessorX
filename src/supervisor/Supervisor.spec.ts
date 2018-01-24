import { expect } from "chai";
import { Supervisor } from "./Supervisor";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { MutatableNode } from "../../DTOs/MutatableNode";

describe("Testing Supervisor", () => {

    let supervisor: Supervisor;
    let stubNodes: Array<IMutatableNode>;
    beforeEach(() => {
        stubNodes = createMutatableNodes(20);
        supervisor = new Supervisor(stubNodes);
    });

    it("creates as many spaces for nodes as there are logical cores", () => {
        supervisor.logicalCores = 3;
        const actual = supervisor.splitNodes(stubNodes);
        expect(actual.length).to.equal(3);
    });

    it("should put 3 nodes into the first core with 12 nodes and 4 cores", () => {
        supervisor.logicalCores = 4;
        const splitNodes = supervisor.splitNodes(createMutatableNodes(12));
        expect(splitNodes[0].length).to.equal(3);
    });

    it("should put 2 nodes into the last core with 11 nodes and 4 cores", () => {
        supervisor.logicalCores = 4;
        const splitNodes = supervisor.splitNodes(createMutatableNodes(11));
        expect(splitNodes[supervisor.logicalCores - 1].length).to.equal(2);
    });
});

function createMutatableNodes (numberOfNodes: Number): Array<IMutatableNode> {
    const nodes: Array<IMutatableNode> = [];
    for (let i = 0; i < numberOfNodes; i++) {
        nodes.push(new MutatableNode(i * 2, {pos: i, end: i + 1}, ""));
    }
    return nodes;
}

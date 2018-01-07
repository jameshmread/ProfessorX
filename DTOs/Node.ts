import { IMutatableNode } from "../interfaces/IMutatableNode";

export class Node implements IMutatableNode {
    constructor (
        public syntaxType: number,
        public positions: { pos: number, end: number },
        public parentFileName: string) {}
}

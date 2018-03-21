import { IMutatableNode } from "../interfaces/IMutatableNode";

export class MutatableNode implements IMutatableNode{
    constructor (
        public syntaxType: number,
        public positions: { pos: number, end: number },
        public parentFileName: string,
        public parentFilePath: string,
        public associatedTestFilePath: string,
        public plainText: string
    ) {}
}

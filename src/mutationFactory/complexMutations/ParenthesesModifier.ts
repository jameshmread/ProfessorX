import { ComplexMutations } from "./ComplexMutations";
import { IMutatableNode } from "../../../interfaces/IMutatableNode";

export class ParenthesesModifier extends ComplexMutations {

    constructor (parenthesisNode: string) {
        super(parenthesisNode);
    }
    public getComplexMutation (): Array<string> {
        if (!this.isNodeValidForMutation(this.plainText)) {
            return [];
        }
        return this.removeDuplicateMutations([
            this.removeParentheses()
        ]);
    }
    public isNodeValidForMutation (nodeText: string): boolean {
        return nodeText[0] === "(" && nodeText[nodeText.length - 1] === ")";
    }

    private removeParentheses (): string {
        return this.plainText.substring(1, this.plainText.length - 1);
    }
}

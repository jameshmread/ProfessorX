import { ComplexMutations } from "./ComplexMutations";
import { IMutatableNode } from "../../../interfaces/IMutatableNode";
import { IMutationArrayAndClass } from "../../../interfaces/IMutationArrayandClass";
import { MutationClass } from "../../../enums/MutationClass";

export class ParenthesesModifier extends ComplexMutations {

    constructor (parenthesisNode: string) {
        super(parenthesisNode);
    }
    public getComplexMutation (): IMutationArrayAndClass {
        if (!this.isNodeValidForMutation(this.plainText)) {
            return {mutations: [], mutationClass: MutationClass.Parenthesis_Removal};
        }
        const arrayOfMutations = this.removeDuplicateMutations([
            this.removeParentheses()
        ]);
        return {mutations: arrayOfMutations, mutationClass: MutationClass.Parenthesis_Removal};
    }
    public isNodeValidForMutation (nodeText: string): boolean {
        return nodeText[0] === "(" && nodeText[nodeText.length - 1] === ")";
    }

    private removeParentheses (): string {
        return this.plainText.substring(1, this.plainText.length - 1);
    }
}

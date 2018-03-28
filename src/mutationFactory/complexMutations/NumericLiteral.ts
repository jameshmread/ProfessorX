import { ComplexMutations } from "./ComplexMutations";
import { MutationClass } from "../../../enums/MutationClass";
import { IMutationArrayAndClass } from "../../../interfaces/IMutationArrayandClass";

export class NumericLiteral extends ComplexMutations {
    private number: number;
    constructor (plainText: string) {
        super(plainText);
        this.number = Number(plainText);
    }

    public getComplexMutation (): IMutationArrayAndClass {
        if (!this.isNodeValidForMutation(this.plainText)) {
            return {mutations: [], mutationClass: MutationClass.NumericLiteral_ConstantChange};
        }
        const arrayOfMutations = this.removeDuplicateMutations([
            this.addOne(), this.minusOne(), this.multiplyByNegative(),
            this.setToValue(0), this.setToValue(1), this.setToValue(-1)
        ]);
        return { mutations: arrayOfMutations, mutationClass: MutationClass.NumericLiteral_ConstantChange};
    }

    public isNodeValidForMutation (nodeText: string) {
        return !isNaN(parseInt(nodeText, 10));
    }

    private addOne (): string {
        let boundChangedNumber = this.number;
        return (boundChangedNumber ++).toString();
    }

    private minusOne (): string {
        let boundChangedNumber = this.number;
        return (boundChangedNumber--).toString();
    }

    private multiplyByNegative (): string {
        const negativeNum = this.number;
        return (negativeNum * -1).toString();
    }

    private setToValue (value: number): string {
        let newNumber = this.number;
        return (newNumber = value).toString();
    }
}

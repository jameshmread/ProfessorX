import { ComplexMutations } from "./ComplexMutations";

export class NumericLiteral extends ComplexMutations {
    private number: number;
    constructor (plainText: string) {
        super(plainText);
        this.number = Number(plainText);
    }

    public getComplexMutation (): Array<string> {
        if (!this.isNodeValidForMutation(this.plainText)) {
            return [];
        }
        return this.removeDuplicateMutations([
            this.addOne(), this.minusOne(), this.multiplyByNegative(),
            this.setToValue(0), this.setToValue(1), this.setToValue(-1)
        ]);
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

import { SyntaxKind } from "typescript";
import { IsyntaxMutationMap } from "../../interfaces/IsyntaxMutationMap";

export class MutationFactory {

    public static mutatableTokens: Array<SyntaxKind> = [
        SyntaxKind.PlusToken,
        SyntaxKind.MinusToken,
        SyntaxKind.TrueKeyword,
        SyntaxKind.FalseKeyword,
        SyntaxKind.PlusPlusToken,
        SyntaxKind.MinusMinusToken,
        SyntaxKind.BarBarToken,
        SyntaxKind.GreaterThanToken,
        SyntaxKind.PercentToken
    ];

    public static syntaxMutationMap: IsyntaxMutationMap = {
        29: [" < ", " <= ", ">=", " != ", " = ", " - ", " + ", " > ", " * ", " / "], // greater than
        37: [" - ", " / ", " * "], // plus
        38: [" + ",  " / ", " * "], // minus
        39: [" / ", " < ", " <= ", ">=", " != ", " - ", " + ", " > ", " / "], // multiply
        42: [" < ", " <= ", ">=", " != ", " - ", " + ", " > ", " * ", " / "], // percentage
        44: ["++"],
        54: [" && "],
        101: [" false"], // true
        86: [" true"] // false
    };


    private static mutatorDescriptions: Array<string> = [
        "Binary Substitution: Swapping an operator in a binary expression",
        "Boolean Substitution: Swapping one boolean value for another",
        "Logical Substitution: Changing a Logical operator for another",
        "Unary Substitution: Swapping an operator in a unary expression",
        "Condition Removal: Removing / Replacing a condition within a control structure"
    ];

    public static getSingleMutation (syntaxKind: SyntaxKind): string {
        return this.syntaxMutationMap[syntaxKind][0];
    }

    public static getMultipleMutations (syntaxKind: SyntaxKind): Array<string> {
        if (this.syntaxMutationMap[syntaxKind] === void 0) {
            return [];
        }
        return this.syntaxMutationMap[syntaxKind];
    }
}

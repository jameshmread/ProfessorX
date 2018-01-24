import { SyntaxKind } from "typescript";
import { IsyntaxMutationMap } from "../../interfaces/IsyntaxMutationMap";

export class MutationFactory {

    public static mutatableTokens: Array<SyntaxKind> = [
        SyntaxKind.PlusToken, SyntaxKind.MinusToken, SyntaxKind.TrueKeyword, SyntaxKind.FalseKeyword,
        SyntaxKind.PlusPlusToken, SyntaxKind.MinusMinusToken, SyntaxKind.BarBarToken, SyntaxKind.GreaterThanToken,
        SyntaxKind.PercentToken, SyntaxKind.AsteriskToken
    ];

    public static syntaxMutationMap: IsyntaxMutationMap = {
        [SyntaxKind.GreaterThanToken]: [" < ", " <= ", ">=", " !== ", " - ", " + ", " * ", " / "],
        [SyntaxKind.PlusToken]: [" - ", " / ", " * "],
        [SyntaxKind.MinusToken]: [" + ",  " / ", " * "],
        [SyntaxKind.AsteriskToken]: [" / ", " < ", " <= ", ">=", " !== ", " - ", " + ", " > "],
        [SyntaxKind.PercentToken]: [" < ", " <= ", ">=", " !== ", " - ", " + ", " > ", " * ", " / "],
        [SyntaxKind.PlusPlusToken]: ["--"],
        [SyntaxKind.MinusMinusToken]: ["++"],
        [SyntaxKind.BarBarToken]: [" && "],
        [SyntaxKind.TrueKeyword]: [" false"],
        [SyntaxKind.FalseKeyword]: [" true"]
    };

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

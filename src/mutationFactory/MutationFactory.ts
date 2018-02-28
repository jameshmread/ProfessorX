import { SyntaxKind } from "typescript";
import { IsyntaxMutationMap } from "../../interfaces/IsyntaxMutationMap";
import { MutationClass } from "../../enums/MutationClass";
import { NumericLiteral } from "./complexMutations/NumericLiteral";
import { IMutatableNode } from "../../interfaces/IMutatableNode";

export class MutationFactory {

    public static readonly mutatableTokens: Array<SyntaxKind> = [
        SyntaxKind.PlusToken, SyntaxKind.MinusToken, SyntaxKind.TrueKeyword, SyntaxKind.FalseKeyword,
        SyntaxKind.PlusPlusToken, SyntaxKind.MinusMinusToken, SyntaxKind.BarBarToken, SyntaxKind.GreaterThanToken,
        SyntaxKind.PercentToken, SyntaxKind.AsteriskToken, SyntaxKind.Block, SyntaxKind.PrivateKeyword,
        SyntaxKind.ProtectedKeyword, SyntaxKind.ReturnStatement, SyntaxKind.NumericLiteral
    ];

    public static readonly syntaxMutationMap: IsyntaxMutationMap = {
        [SyntaxKind.GreaterThanToken]: ["<", "<=", ">=", "!==", "-", "+", "*", "/"],
        [SyntaxKind.PlusToken]: ["-", "/", "*"],
        [SyntaxKind.MinusToken]: ["+", "/", "*"],
        [SyntaxKind.AsteriskToken]: ["/ ", "<", "<=", ">=", "!==", "-", "+", ">"],
        [SyntaxKind.PercentToken]: ["<", "<=", ">=", "!==", "-", "+", ">", "*", "/"],
        [SyntaxKind.PlusPlusToken]: ["--"],
        [SyntaxKind.MinusMinusToken]: ["++"],
        [SyntaxKind.BarBarToken]: ["&&"],
        [SyntaxKind.TrueKeyword]: ["false"],
        [SyntaxKind.FalseKeyword]: ["true"],
        [SyntaxKind.Block]: ["{}"],
        [SyntaxKind.PrivateKeyword]: ["protected"],
        [SyntaxKind.ProtectedKeyword]: ["private"],
        [SyntaxKind.ReturnStatement]: ["return null"]
    };

    public static getSingleMutation (syntaxKind: SyntaxKind): string {
        return this.syntaxMutationMap[syntaxKind][0];
    }

    public static getAllMutations (node: IMutatableNode): Array<string> {
        return this.getMultipleMutations(node.syntaxType).concat(this.getComplexMutations(node));
    }

    public static getMultipleMutations (syntaxKind: SyntaxKind): Array<string> {
        if (this.syntaxMutationMap[syntaxKind] === void 0) {
            return [];
        }
        return this.syntaxMutationMap[syntaxKind];
    }

    private static getComplexMutations (node: IMutatableNode): Array<string> {
        const numbLitteral = new NumericLiteral(node.plainText);
        return numbLitteral.getComplexMutation();
    }
}

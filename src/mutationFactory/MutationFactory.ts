import { SyntaxKind } from "typescript";
import { IsyntaxMutationMap } from "../../interfaces/IsyntaxMutationMap";
import { MutationClass } from "../../enums/MutationClass";
import { NumericLiteral } from "./complexMutations/NumericLiteral";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { ParenthesesModifier } from "./complexMutations/ParenthesesModifier";
import { IMutationArrayAndClass } from "../../interfaces/IMutationArrayandClass";

export class MutationFactory {

    public static readonly mutatableTokens: Array<SyntaxKind> = [
        SyntaxKind.PlusToken, SyntaxKind.MinusToken, SyntaxKind.TrueKeyword, SyntaxKind.FalseKeyword,
        SyntaxKind.PlusPlusToken, SyntaxKind.MinusMinusToken, SyntaxKind.BarBarToken, SyntaxKind.GreaterThanToken,
        SyntaxKind.PercentToken, SyntaxKind.AsteriskToken, SyntaxKind.Block, SyntaxKind.PrivateKeyword,
        SyntaxKind.ProtectedKeyword, SyntaxKind.ReturnStatement, SyntaxKind.NumericLiteral,
        SyntaxKind.ParenthesizedExpression
    ];

    public static readonly syntaxMutationMap: IsyntaxMutationMap = {
        [SyntaxKind.GreaterThanToken]: { mutations: ["<", "<=", ">=", "!==", "-", "+", "*", "/"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.PlusToken]: { mutations: ["-", "/", "*"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.MinusToken]: { mutations: ["+", "/", "*"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.AsteriskToken]: { mutations: ["/", "<", "<=", ">=", "!==", "-", "+", ">"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.PercentToken]: { mutations: ["<", "<=", ">=", "!==", "-", "+", ">", "*", "/"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.PlusPlusToken]: { mutations: ["--"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.MinusMinusToken]: { mutations: ["++"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.BarBarToken]: { mutations: ["&&"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.TrueKeyword]: { mutations: ["false"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.FalseKeyword]: { mutations: ["true"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.Block]: { mutations: [
            `{

            }`, `{
                return null;
            }`],
            mutationClass: MutationClass.Block_Null
        },
        [SyntaxKind.PrivateKeyword]: { mutations: ["protected"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.ProtectedKeyword]: { mutations: ["private"],
            mutationClass: MutationClass.Binary_Substitution
        },
        [SyntaxKind.ReturnStatement]: { mutations: ["return null;"],
            mutationClass: MutationClass.Binary_Substitution
        }
    };

    public static getAllMutations (node: IMutatableNode): Array<IMutationArrayAndClass> {
        return [].concat(...[this.getMultipleMutations(node.syntaxType), this.getComplexMutations(node)]);
    }

    public static getMultipleMutations (syntaxKind: SyntaxKind): IMutationArrayAndClass {
        if (this.syntaxMutationMap[syntaxKind] === void 0) {
            return {mutations: [], mutationClass: "No Simple Mutations Found for this Syntax Kind"};
        }
        return this.syntaxMutationMap[syntaxKind];
    }

    private static getComplexMutations (node: IMutatableNode): Array<IMutationArrayAndClass> {
        const numbLitteral = new NumericLiteral(node.plainText);
        const parentheses = new ParenthesesModifier(node.plainText);
        return [
            numbLitteral.getComplexMutation(),
            parentheses.getComplexMutation()];
    }
}

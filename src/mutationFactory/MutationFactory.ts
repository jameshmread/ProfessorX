import {SyntaxKind} from "typescript";
import {IsyntaxMutationMap} from "../../interfaces/IsyntaxMutationMap";

export class MutationFactory {
    private static syntaxMutationMap: IsyntaxMutationMap = {
        37: ["-"],
        38: ["+"],
        39: ["/"],
        101: ["false"],
        86: ["true"]
    };

    public static getSingleMutation (syntaxKind: SyntaxKind): string {
        return this.syntaxMutationMap[syntaxKind][0];
    }
}

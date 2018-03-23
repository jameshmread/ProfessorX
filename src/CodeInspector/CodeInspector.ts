import { Node, SourceFile, SyntaxKind } from "typescript";
import { ValidMutationRules } from "./ValidMutationRules";
import { Logger } from "../logging/Logger";

export class CodeInspector {
    private static retrievedObjects: Array<Node> = [];
    constructor (private sourceObject: SourceFile) {}

    public static isNodeMutatable (node: Node): boolean {
        const mutationRules = new ValidMutationRules();
        mutationRules.setNodeFamily(node);
        if (mutationRules.nodeFamily === void 0) { return false; }
        return mutationRules.traverseRuleTree(ValidMutationRules.RULE_TREE, 0);
    }

    public findObjectsOfSyntaxKind (kind: SyntaxKind): Array<Node> {
        CodeInspector.retrievedObjects = [];
        CodeInspector.findTokenObjectsOfKind(this.sourceObject, kind);
        return CodeInspector.retrievedObjects;
    }

    private static findTokenObjectsOfKind (object: Node, kind: SyntaxKind)
    : Array<Node> {
        if (object.kind === kind && CodeInspector.isNodeMutatable(object)) {
            CodeInspector.retrievedObjects.push(object);
        }
        object.forEachChild((element) => {
            this.findTokenObjectsOfKind(element, kind);
        });
        return CodeInspector.retrievedObjects;
    }
}
// I really want to change how this is done at some point
// dont want to rely on doing this recursivley every time for each node.
// instead I want to loop through every file and get all the objects TOTAL

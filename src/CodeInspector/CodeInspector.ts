import { Node, SourceFile, SyntaxKind } from "typescript";

export class CodeInspector {
    private static retrievedObjects: Array<{pos: number, end: number}> = [];
    constructor (private sourceObject: SourceFile) {}

    public findObjectsOfSyntaxKind (kind: SyntaxKind) {
        CodeInspector.retrievedObjects = [];
        CodeInspector.findTokenObjectsOfKind(this.sourceObject, kind);
        return CodeInspector.retrievedObjects;
    }

    private static findTokenObjectsOfKind (object: Node, kind: SyntaxKind)
    : Array<{pos: number, end: number}> {
        if (object.kind === kind) {
            CodeInspector.retrievedObjects.push({pos: object.pos, end: object.end});
        }
        object.getChildren().forEach((element) => {
            this.findTokenObjectsOfKind(element, kind);
        });
        return CodeInspector.retrievedObjects;
    }
}

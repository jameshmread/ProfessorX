import { Node, SourceFile, SyntaxKind } from "typescript";

export class CodeInspector {
    private retrievedObjects: Array<{pos: number, end: number}> = [];
    constructor (private sourceObject: SourceFile) {}

    public findObjectsOfSyntaxKind (kind: SyntaxKind) {
        this.retrievedObjects = [];
        this.findTokenObjectsOfKind(this.sourceObject, kind);
        return this.retrievedObjects;
    }

    private findTokenObjectsOfKind (object: Node, kind: SyntaxKind)
    : Array<{pos: number, end: number}> {
        if (object.kind === kind) {
            this.retrievedObjects.push({pos: object.pos, end: object.end});
        }
        object.getChildren().forEach((element) => {
            this.findTokenObjectsOfKind(element, kind);
        });
        return this.retrievedObjects;
    }
}

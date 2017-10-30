import * as ts from "typescript";

export class CodeInspector {
    private retrievedObjects: Array<{pos: number, end: number}> = [];
    constructor (private sourceObject: ts.SourceFile) {}

    public findObjectsOfSyntaxKind (kind: ts.SyntaxKind) {
        this.retrievedObjects = [];
        this.findTokenObjectsOfKind(this.sourceObject, kind);
        return this.retrievedObjects;
    }

    private findTokenObjectsOfKind (object: ts.Node, kind: ts.SyntaxKind)
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

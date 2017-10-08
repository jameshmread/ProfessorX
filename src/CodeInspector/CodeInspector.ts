import * as ts from "typescript";

export class CodeInspector {
    private retrievedObjects: Array<ts.Node> = [];
    constructor (private sourceObject: ts.SourceFile) {}

    public findObjectsOfSyntaxKind (kind: ts.SyntaxKind) {
        this.retrievedObjects = [];
        this.findTokenObjectsOfKind(this.sourceObject, kind);
        return this.retrievedObjects;
    }

    private findTokenObjectsOfKind (object: ts.Node, kind: ts.SyntaxKind): Array<ts.Node> {
        if (object.kind === kind) {
            this.retrievedObjects.push(object);
        }
        object.getChildren().forEach((element) => {
            this.findTokenObjectsOfKind(element, kind);
        });
        return this.retrievedObjects;
    }
}

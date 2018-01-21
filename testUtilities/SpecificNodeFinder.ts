import { SyntaxKind, Node } from "typescript";

export class SpecificNodeFinder {
      public retrievedObjects = [];

      public findObjectsOfSyntaxKind (kind: SyntaxKind, sourceObject) {
            return this.findTokenObjectsOfKind(sourceObject, kind);
      }

      public findTokenObjectsOfKind (object: Node, kind: SyntaxKind) {
            if (object.kind === kind) {
                  this.retrievedObjects.push(object);
            }
            object.forEachChild((element) => {
                  this.findTokenObjectsOfKind(element, kind);
            });
            return this.retrievedObjects;
      }
}

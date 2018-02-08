import { SourceFile } from "typescript";
import { SourceObject } from "../../DTOs/SourceObject";
import { IMutatableNode } from "../../interfaces/IMutatableNode";

export class SourceCodeHandler {

    constructor (private readonly sourceObj: SourceObject) {}

    public getOriginalSourceObject (): SourceFile {
        return this.sourceObj.origionalSourceObject;
    }

    public getOriginalSourceCode (): string {
        return this.sourceObj.origionalSourceObject.getText();
    }

    public getModifiedSourceCode (): string {
        return this.sourceObj.modifiedSourceCode;
    }

    public resetModified (): void {
        this.sourceObj.modifiedSourceCode = this.sourceObj.origionalSourceObject.getText();
    }

    public modifyCode (currentNode: IMutatableNode, replacement: string) {
        this.sourceObj.modifiedSourceCode = this.sourceObj.modifiedSourceCode
        .substring(0, currentNode.positions.pos) + " "
        + replacement
        + this.sourceObj.modifiedSourceCode
        .substring(currentNode.positions.end, this.sourceObj.modifiedSourceCode.length);
    }
}

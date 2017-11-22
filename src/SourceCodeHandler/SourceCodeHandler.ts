import { SourceFile } from "typescript";
import { SourceObject } from "../../DTOs/SourceObject";

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

    public modifyCode (start: number, end: number, replacement: string) {
        this.sourceObj.modifiedSourceCode =
        this.sourceObj.modifiedSourceCode.substring(0, start)
        + replacement
        + this.sourceObj.modifiedSourceCode.substring(end + 1, this.sourceObj.modifiedSourceCode.length);
    }
}

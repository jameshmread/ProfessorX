import * as ts from "typescript";

export class SourceCodeHandler {
    private modifiedSourceCode: string = this.originalSourceObject.getText();

    constructor (private readonly originalSourceObject: ts.SourceFile) {}

    public getOriginalSourceObject (): ts.SourceFile {
        return this.originalSourceObject;
    }

    public getOriginalSourceCode (): string {
        return this.originalSourceObject.getText();
    }

    public getModifiedSourceCode (): string {
        return this.modifiedSourceCode;
    }

    public resetModified (): void {
        this.modifiedSourceCode = this.originalSourceObject.getText();
    }

    public modifyCode ( start: number, end: number, replacement: string) {
        this.modifiedSourceCode =
        this.modifiedSourceCode.substring(0, start)
        + replacement
        + this.modifiedSourceCode.substring(end + 1, this.modifiedSourceCode.length);
    }
}

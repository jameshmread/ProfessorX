import * as ts from "typescript";
import * as fs from "fs";

import { FileObject } from "../../DTOs/FileObject";

export class FileHandler {

    public file: FileObject;
    constructor (file: FileObject) {
        this.file = file;
        if (!fs.existsSync(this.file.fullPath)) {
            throw new Error(`File '${this.file.fullPath}' doesn't exist`);
        }
        if (!(this.file.filename.substring(this.file.filename.length - 3) === ".ts")) {
            throw new Error("Typescript files must end with .ts");
        }
        this.file.testFileName = this.file.path +
        this.file.filename.substring(0, this.file.filename.length - 2) +
        "spec.ts";
        if (!fs.existsSync(this.file.testFileName)) {
            throw new Error("No existing test file that matches this file");
        }
    }

    public getSourceCode (): string {
        if (!this.file.sourceCode) {
            this.file.sourceCode = this.readFile(this.file.fullPath);
        }
        return this.file.sourceCode;
    }

    public getSourceObject (): ts.SourceFile {
        return (this.file.sourceObject) ? this.file.sourceObject :
            ts.createSourceFile(this.file.filename, this.getSourceCode (), ts.ScriptTarget.ES2015, true);
    }

    public writeTempSourceModifiedFile (modifiedCode: string): string {
        const tempFilename = 
        this.file.fullPath + FileObject.counter + "C" + this.file.coreNumber + FileObject.M_SOURCE_FILE_SUFFIX;
        fs.writeFileSync(tempFilename, modifiedCode);
        return tempFilename;
    }

    public createTempTestModifiedFile (): string {
        const updatedContents = this.mutateTestFileReference(this.getTestFileContents());
        const tempFilename =
            this.file.fullPath + FileObject.counter++ + "C" + this.file.coreNumber + FileObject.M_TEST_FILE_SUFFIX;
        fs.writeFileSync(tempFilename, updatedContents);
        return tempFilename;
    }

    public mutateTestFileReference (contents: string): string {
        const filenameNoExtension = this.file.filename.substring(0, this.file.filename.length - 3);
        contents = contents.replace(
            "/" + filenameNoExtension,
            "/" + filenameNoExtension + ".ts" + FileObject.counter + "C" + this.file.coreNumber + ".m");
        return contents;
    }

    private readFile (path: string): string {
        return fs.readFileSync(path).toString();
    }

    private getTestFileContents (): string {
        if (!this.file.testFileContents) {
            this.file.testFileContents = this.readFile(this.file.testFileName);
        }
        return this.file.testFileContents;
    }
}

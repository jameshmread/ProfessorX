import * as ts from "typescript";
import * as fs from "fs";

import { FileObject } from "../../DTOs/FileObject";
import { Logger } from "../logging/Logger";
import { FileExtensions } from "../../enums/FileExtensions";

export class FileHandler {

    public file: FileObject;

    constructor (file: FileObject) {
        this.file = file;
        if (!fs.existsSync(this.file.fullPath)) {
            Logger.fatal("File Path requested doesn't exist", this.file);
            throw new Error(`File '${this.file.fullPath}' doesn't exist`);
        }
        if (!(this.file.filename.substring(this.file.filename.length - 3) === ".ts")) {
            Logger.fatal("Incorrect file extension filtered out", this.file);
            throw new Error("Typescript files must end with .ts");
        }
        this.file.testFileName = this.file.path +
        this.file.filename.substring(0, this.file.filename.length - 3) + FileExtensions.test;
        if (!fs.existsSync(this.file.testFileName)) {
            Logger.fatal(`No test file found matching this source file.
            Spelling of source and test must match exactly and test must end in .spec.ts`, this.file);
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
            "/" + filenameNoExtension + ".ts" + FileObject.counter + "C" + this.file.coreNumber + ".m"
        );
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

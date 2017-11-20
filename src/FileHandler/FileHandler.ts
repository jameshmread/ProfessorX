import * as ts from "typescript";
import * as fs from "fs";

export class FileHandler {
    public static readonly M_SOURCE_FILE_SUFFIX = ".m.ts";
    public static readonly M_TEST_FILE_SUFFIX = ".spec" + FileHandler.M_SOURCE_FILE_SUFFIX;
    private static counter = 0;
    private readonly FULL_PATH: string;
    private sourceCode: string;
    private sourceObject: ts.SourceFile;
    private testFileContents: string;
    private testFileName: string;

    constructor (private path: string, private filename: string) {
        this.FULL_PATH = path + filename;
        if (!fs.existsSync(this.FULL_PATH)) {
            throw new Error(`File '${this.FULL_PATH}' doesn't exist`);
        }
        if (!(filename.substring(filename.length - 3) === ".ts")) {
            throw new Error("Typescript files must end with .ts");
        }
        this.testFileName = path + filename.substring(0, filename.length - 2) + "spec.ts";
        if (!fs.existsSync(this.testFileName)) {
            throw new Error("No existing test file that matches this file");
        }
    }

    public getSourceCode (): string {
        if (!this.sourceCode) {
            this.sourceCode = this.readFile(this.FULL_PATH);
        }
        return this.sourceCode;
    }

    public getSourceObject (): ts.SourceFile {
        return (this.sourceObject) ? this.sourceObject :
            ts.createSourceFile(this.filename, this.getSourceCode (), ts.ScriptTarget.ES2015, true);
    }

    public writeTempSourceModifiedFile (modifiedCode: string): string {
        const tempFilename = this.FULL_PATH + FileHandler.counter + FileHandler.M_SOURCE_FILE_SUFFIX;
        fs.writeFileSync(tempFilename, modifiedCode);
        return tempFilename;
    }

    public createTempTestModifiedFile (): string {
        const updatedContents = this.mutateTestFileReference(this.getTestFileContents());
        const tempFilename = this.FULL_PATH + FileHandler.counter++ + FileHandler.M_TEST_FILE_SUFFIX;
        fs.writeFileSync(tempFilename, updatedContents);
        return tempFilename;
    }

    public mutateTestFileReference (contents: string): string {
        const filenameNoExtension = this.filename.substring(0, this.filename.length - 3);
        contents = contents.replace(
            "/" + filenameNoExtension,
            "/" + filenameNoExtension + ".ts" + FileHandler.counter + ".m");
        return contents;
    }

    private readFile (path: string): string {
        return fs.readFileSync(path).toString();
    }

    private getTestFileContents (): string {
        if (!this.testFileContents) {
            this.testFileContents = this.readFile(this.testFileName);
        }
        return this.testFileContents;
    }
}

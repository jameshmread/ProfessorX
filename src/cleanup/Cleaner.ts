import * as fs from "memfs";

import { FileHandler } from "../FileHandler/FileHandler";

export class Cleaner {
    public readonly fileExtensionToRemove = FileHandler.M_SOURCE_FILE_SUFFIX;
    public readonly FILE_PATH;

    constructor (filePath: string) {
        this.FILE_PATH = filePath;
    }

    public deleteMutatedSourceFile (filePath: string) {
        fs.unlink(filePath);
    }

    public deleteMutatedTestFile (filePath: string) {
        if (!this.isTestFile(filePath)) {
            throw new Error(`${filePath} is not a mutated test file. Aborting...`);
        }
        fs.unlink(filePath);
    }

    public isTestFile (filePath: string): boolean {
        return filePath.substring(filePath.length - this.fileExtensionToRemove.length) === this.fileExtensionToRemove;
    }

}

import * as fs from "fs";

import { FileHandler } from "../FileHandler/FileHandler";

export class Cleaner {
    public static readonly fileExtensionToRemove = FileHandler.M_SOURCE_FILE_SUFFIX;
    public static filesToDelete: Array<string> = [];

    public static deleteSourceFile (fileToDelete: string) {
        fs.unlink(fileToDelete);
    }

    public static deleteTestFile (filePath: string) {
        if (!Cleaner.isTestFile(filePath)) {
            throw new Error(`${filePath} is not a mutated test file. Aborting...`);
        }
        fs.unlink(filePath);
    }

    public static isTestFile (filePath: string): boolean {
        return filePath.substring(filePath.length - Cleaner.fileExtensionToRemove.length)
        === Cleaner.fileExtensionToRemove;
    }

}

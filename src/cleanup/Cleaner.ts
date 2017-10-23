import * as fs from "fs";

import { FileHandler } from "../FileHandler/FileHandler";

export class Cleaner {
    public readonly fileExtensionToRemove = FileHandler.M_SOURCE_FILE_SUFFIX;
    public readonly FILE_PATH;
    public filesToDelete: Array<string> = [];

    constructor (filePath: string) {
        this.FILE_PATH = filePath;
    }

    public findMutatedFiles () {
        const filesFoundInDirectory = fs.readdirSync(this.FILE_PATH);

        for (let i = 0; i < filesFoundInDirectory.length; i++){
            if (this.isTestFile(filesFoundInDirectory[i])){
                this.filesToDelete.push(filesFoundInDirectory[i]);
            }
        }
        return this.filesToDelete;
    }

    public deleteMutatedFiles (filesToDelete: Array<string>) {
        for (let i = 0; i < filesToDelete.length; i++) {
            fs.unlinkSync(this.FILE_PATH + filesToDelete[i]);
        }
    }

    public deleteTestFile (filePath: string) {
        if (!this.isTestFile(filePath)) {
            throw new Error(`${filePath} is not a mutated test file. Aborting...`);
        }
        fs.unlinkSync(filePath);
    }

    public isTestFile (filePath: string): boolean {
        return filePath.substring(filePath.length - this.fileExtensionToRemove.length) === this.fileExtensionToRemove;
    }

}

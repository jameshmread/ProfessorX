import * as fs from "fs";

import { FileObject } from "../../DTOs/FileObject";
import { ConfigManager } from "../configManager/ConfigManager";
import { Logger } from "../logging/Logger";

export class Cleaner {

    public static deleteSourceFile (fileToDelete: string) {
        fs.unlink(fileToDelete, (err) =>
            Logger.warn("Could not delete source file", {filePath: fileToDelete, error: err})
        );
    }

    public static deleteTestFile (filePath: string) {
        if (!Cleaner.isMutatedFile(filePath)) {
            Logger.warn(`${filePath} is not a mutated test file. Tried to delete a non mutated file.`);
        }
        fs.unlink(filePath, (err) =>
        Logger.warn("Could not delete test file", {path: filePath, error: err})
    );
    }

    public static cleanRemainingFiles () {
        const fileArray = fs.readdirSync(ConfigManager.filePath);
        Cleaner.removeFoundFiles(
            Cleaner.filterMutatedFiles(fileArray)
        );
    }

    public static filterMutatedFiles (fileArray) {
        const filtered = fileArray.filter((element) => {
            return Cleaner.isMutatedFile(element);
        });
        return filtered;
    }


    public static isMutatedFile (filePath: string): boolean {
        return filePath.substring(filePath.length - FileObject.M_SOURCE_FILE_SUFFIX.length)
        === FileObject.M_SOURCE_FILE_SUFFIX;
    }

    private static removeFoundFiles (fileArray) {
        fileArray.forEach((file) => {
            fs.unlinkSync(ConfigManager.filePath + file);
        });
    }

}

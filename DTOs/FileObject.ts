import { basename } from "path";
import { SourceFile } from "typescript";

import { ConfigManager } from "../src/configManager/ConfigManager";

export class FileObject {

      public static readonly M_SOURCE_FILE_SUFFIX = ".m.ts";
      public static readonly M_TEST_FILE_SUFFIX = ConfigManager.testFileExtension + FileObject.M_SOURCE_FILE_SUFFIX;
      public static counter = 0;

      public coreNumber = 0;

      public fullPath: string;
      public filename: string;
      public sourceCode: string;
      public sourceObject: SourceFile;
      public testFileContents: string;
      public testFilePath: string;
      public testFileName: string;

      constructor (resolvedFilePath: string, resolvedTestFilePath: string) {
            this.fullPath = resolvedFilePath;
            this.filename = basename(resolvedFilePath);
            this.testFilePath = resolvedTestFilePath;
            this.testFileName = basename(resolvedTestFilePath);
      }
}

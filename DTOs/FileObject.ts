import { SourceFile } from "typescript";

export class FileObject {

      public static readonly M_SOURCE_FILE_SUFFIX = ".m.ts";
      public static readonly M_TEST_FILE_SUFFIX = ".spec" + FileObject.M_SOURCE_FILE_SUFFIX;
      public static counter = 0;

      public fullPath: string;
      public path: string;
      public filename: string;
      public sourceCode: string;
      public sourceObject: SourceFile;
      public testFileContents: string;
      public testFileName: string;

      constructor (path: string, filename: string) {
            this.path = path;
            this.filename = filename;
            this.fullPath = path + filename;
      }
}

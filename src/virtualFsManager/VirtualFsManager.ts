import * as diskFs from "fs";
import * as vFs from "memfs";

export class VirtualFsManager {
      public static sourceFiles: Array<Buffer> = [];
      public static testFiles: Array<Buffer> = [];
      private projectDirectory: Array<string>;

      constructor (public projectFilePath: string){
            this.projectDirectory = diskFs.readdirSync(projectFilePath);
      }

      public getProjectFiles () {
            this.projectDirectory.forEach((file) => {
                  if (this.isTypescriptSourceFile(file)){
                        VirtualFsManager.sourceFiles.push(diskFs.readFileSync(this.projectFilePath + file));
                  }
                  if (this.isTypescriptTestFile(file)){
                        VirtualFsManager.testFiles.push(diskFs.readFileSync(this.projectFilePath + file));
                  }
            });
            if (!this.sourceFileCountMatchTestFileCount()){
                  throw new Error(`Source files missing some test files:
                  The number of source files does not match the number of test files.`);
            }
      }

      public isTypescriptSourceFile (fileName: string): boolean {
            if (this.isTypescriptTestFile(fileName)) {
                  return false;
            }
            return fileName.indexOf(".ts", fileName.length - 3) >= 0;
      }
      public isTypescriptTestFile (fileName: string): boolean {
            return fileName.indexOf(".spec.ts", fileName.length - 8) >= 0;

      }

      public sourceFileCountMatchTestFileCount (): boolean {
            return VirtualFsManager.sourceFiles.length - VirtualFsManager.testFiles.length === 0;
      }
}

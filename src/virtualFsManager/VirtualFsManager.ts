import * as diskFs from "fs";
import * as vFs from "memfs";

export class VirtualFsManager {
      public static sourceFiles: Array<{fileName: string, contents: Buffer}> = [];
      public static testFiles: Array<{fileName: string, contents: Buffer}> = [];
      private projectDirectory: Array<string>;

      constructor (public projectFilePath: string){
            this.projectDirectory = diskFs.readdirSync(projectFilePath);
      }

      public createVirtualFs () {
            vFs.mkdirpSync("/src/");
            for (let i = 0; i < VirtualFsManager.sourceFiles.length; i++) {
                  vFs.writeFileSync(
                        "/src/" +
                        VirtualFsManager.sourceFiles[i].fileName,
                        VirtualFsManager.sourceFiles[i].contents
                  );
                  vFs.writeFileSync(
                        "/src/" +
                        VirtualFsManager.testFiles[i].fileName,
                        VirtualFsManager.testFiles[i].contents
                  );
            }
      }

      public getProjectFiles () {
            this.projectDirectory.forEach((file) => {
                  if (this.isTypescriptSourceFile(file)){
                        VirtualFsManager.sourceFiles.push(
                              {
                                    fileName: file,
                                    contents: diskFs.readFileSync(this.projectFilePath + file)
                              });
                  }
                  if (this.isTypescriptTestFile(file)){
                        VirtualFsManager.testFiles.push(
                              {
                                    fileName: file,
                                    contents: diskFs.readFileSync(this.projectFilePath + file)
                              });
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

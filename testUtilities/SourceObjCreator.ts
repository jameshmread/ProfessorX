import { createSourceFile, ScriptTarget, SourceFile } from "typescript";

export class SourceObjCreator {
      public sourceFile: SourceFile;
      constructor (code: string) {
            this.sourceFile = createSourceFile("", code, ScriptTarget.ES5, true);
      }
}

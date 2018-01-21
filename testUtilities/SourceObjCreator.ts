import { createSourceFile, ScriptTarget, SourceFile } from "typescript";

export class SourceObjCreator {
      public sourceObj: SourceFile;
      constructor (code: string) {
            this.sourceObj = createSourceFile("", code, ScriptTarget.ES5, true);
      }
}

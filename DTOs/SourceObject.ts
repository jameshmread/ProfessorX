import { SourceFile } from "typescript";

export class SourceObject {
      public origionalSourceObject: SourceFile;
      public modifiedSourceCode: string;
      constructor (sourceFile: SourceFile) {
            this.origionalSourceObject = sourceFile;
            this.modifiedSourceCode = this.origionalSourceObject.getText();
      }
}

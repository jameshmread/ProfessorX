import { Component, OnInit, Input } from "@angular/core";

import { ICodeDisplay } from "../../../../interfaces/ICodeDisplay";

@Component({
  selector: "app-code-change-display",
  templateUrl: "./code-change-display.component.html",
  styleUrls: ["./code-change-display.component.css"]
})

export class CodeChangeDisplayComponent implements OnInit {

  @Input() public survivingMutants = {};
  public codeObjects: Array<ICodeDisplay> = [];

  public ngOnInit () {
    for (let i = 0; i < Object.keys(this.survivingMutants).length; i++){
      this.codeObjects.push({
        lineNumber: this.survivingMutants[i]["lineNumber"],
        sourceFile: this.survivingMutants[i]["SRC_FILE"],
        origionalCode: this.survivingMutants[i]["origionalCode"],
        mutatedCode: this.survivingMutants[i]["mutatedCode"]
      });
      // mutator type needs to be brought in too
    }
    this.sortCodeByLineNumber();
  }

  public sortCodeByLineNumber () {
    this.codeObjects.sort((a, b) => a.lineNumber - b.lineNumber);
  }
}

import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-code-change-display",
  templateUrl: "./code-change-display.component.html",
  styleUrls: ["./code-change-display.component.css"]
})
export class CodeChangeDisplayComponent implements OnInit {

  @Input() public survivingMutants = {};

  private srcFiles = [];
  private lineNumbers = [];
  private origionalCode = [];
  private mutatedCode = [];

  constructor () {
  }

  public ngOnInit () {
    for (let i = 0; i < Object.keys(this.survivingMutants).length; i++){
      this.srcFiles.push(this.survivingMutants[i]["SRC_FILE"]);
      this.lineNumbers.push(this.survivingMutants[i]["lineNumber"]);
      this.origionalCode.push(this.survivingMutants[i]["origionalCode"]);
      this.mutatedCode.push(this.survivingMutants[i]["mutatedCode"]);
    }
  }

}

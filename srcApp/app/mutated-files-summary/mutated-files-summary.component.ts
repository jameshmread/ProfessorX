import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-mutated-files-summary",
  templateUrl: "./mutated-files-summary.component.html",
  styleUrls: ["./mutated-files-summary.component.css"]
})
export class MutatedFilesSummaryComponent implements OnInit {

  @Input() public sourceFiles;
  @Input() public sourceFilePath;

  constructor () { }

  public ngOnInit () {
  }

}

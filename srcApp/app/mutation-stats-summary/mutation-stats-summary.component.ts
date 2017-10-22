import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-mutation-stats-summary",
  templateUrl: "./mutation-stats-summary.component.html",
  styleUrls: ["./mutation-stats-summary.component.css"]
})
export class MutationStatsSummaryComponent implements OnInit {

  @Input() public totalMutationScore;
  @Input() public totalFailedTests;
  @Input() public totalPassedTests;

  constructor () { }

  ngOnInit() {
  }

}

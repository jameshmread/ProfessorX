import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-mutation-stats-summary",
  templateUrl: "./mutation-stats-summary.component.html",
  styleUrls: ["./mutation-stats-summary.component.css"]
})
export class MutationStatsSummaryComponent implements OnInit {

  @Input() public totalMutationScore;
  @Input() public killedMutants;
  @Input() public survivingMutants;

  constructor () { }

  public ngOnInit () {
  }

}

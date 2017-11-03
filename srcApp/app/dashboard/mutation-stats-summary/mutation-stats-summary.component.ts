import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-mutation-stats-summary",
  templateUrl: "./mutation-stats-summary.component.html",
  styleUrls: ["./mutation-stats-summary.component.css"]
})
export class MutationStatsSummaryComponent implements OnInit {

  @Input() public mutatorResults: Array<boolean> = [];

  public killedMutants;
  public survivingMutants;

  public totalMutationScore;

  public ngOnInit () {
    this.killedMutants = this.getKilledMutants(this.mutatorResults);
    this.survivingMutants = this.mutatorResults.length - this.killedMutants;
    this.setMutationScore();
  }

  public setMutationScore (){
      if (this.survivingMutants === 0){
        this.totalMutationScore = 100;
      }else {
        this.totalMutationScore =
        (this.killedMutants / (this.survivingMutants + this.killedMutants)) * 100;
      }
  }

  public getKilledMutants (mutatorResults: Array<boolean>): number {
    return mutatorResults.filter((a) => a === true).length;
  }
}

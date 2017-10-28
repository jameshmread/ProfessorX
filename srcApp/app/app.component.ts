import { Component } from "@angular/core";

import {SelectItem} from "primeng/primeng";
// import * as outputStore from "./outputStoreData.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  // way too many variables here, need to refactor into an object
  public duration;
  public outputStore: Object;
  public runner: string;
  public runnerConfig: Object;
  public testFilePaths: Array<string> = [];
  public lineNumbers: Array<number> = [];
  public origionalCode: Array<string> = [];
  public mutatedCode: Array<string> = [];
  public mutatorResults: Array<boolean> = [];
  //
  // public passedTests: Array<number> = [];
  // public failedTests: Array<number> = [];
  // due to changes, are these needed?

  // fields passed to other components
  public sourceFilePath: string;
  public sourceFiles: Array<string> = [];
  public totalSurvivingMutants: number;
  public totalKilledMutants: number;
  public totalMutationScore: number;

  public currentTab = "In-Depth View";

  public cities = [{label: "HelloWorld.ts", value: {id: 1, name: "HelloWorld.ts"}},
  {label: "Glasgow", value: {id: 2, name: "glas", code: "gl"}}];
  public selectedCity = "HelloWorld.ts";

  constructor () {
    this.importData();
    this.importOutputStores();
  }

  public async importData () {
      await import("./data.json").then((data) => {this.duration = data; });
  }

  public async importOutputStores () {
      await import("./outputStoreData.json").then((data) => {
        this.outputStore = data;
        this.setMutationInformation(this.outputStore);
      });
  }

  public getProgramTotalMutationScore (mutationScores: Array<boolean>) {
    const totalScore = this.getKilledMutants(mutationScores);
    if (mutationScores.length === 0 || totalScore === 0){
      return 0;
    } else {
      return totalScore / mutationScores.length;
    }
  }

  public getKilledMutants (mutatorResults: Array<boolean>): number {
    return mutatorResults.filter((a) => a === true).length;
  }

  public getCurrentTab (event){
    this.currentTab = event;
  }

  private setMutationInformation (outputStore: Object) {
    this.sourceFilePath = (outputStore[0]["SRC_FILE_PATH"]);
    this.sourceFiles.push(outputStore[0]["SRC_FILE"]);
    this.runner = (outputStore[0]["RUNNER"]);
    this.runnerConfig = outputStore[0]["RUNNER_CONFIG"];

    for (let i = 0; i < Object.keys(outputStore).length; i++) {
      this.testFilePaths.push(outputStore[i]["testFilePath"]);
      this.lineNumbers.push(outputStore[i]["lineNumber"]);
      this.mutatedCode.push(outputStore[i]["mutatedCode"]);
      this.origionalCode.push(outputStore[i]["origionalCode"]);
      // this.passedTests.push(outputStore[i]["numberOfPassedTests"]);
      // this.failedTests.push(outputStore[i]["numberOfFailedTests"]);
      // see above, probably dont need these two ^^
      this.mutatorResults.push(outputStore[i]["mutantKilled"]);
    }
    this.totalKilledMutants = this.getKilledMutants(this.mutatorResults);
    this.totalSurvivingMutants = this.mutatorResults.length - this.totalKilledMutants;
    // this.totalMutationScore = this.totalKilledMutants - this.totalSurvivingMutants
  }
}

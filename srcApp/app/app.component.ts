import { Component } from "@angular/core";

import * as outputStore from "./outputStoreData.json";
import * as data from "./data.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  // way too many variables here, need to refactor into an object
  public duration = data;
  public sourceFilePath: string;
  public sourceFiles: Array<string> = [];
  public runner: string;
  public runnerConfig: Object;
  public testFilePaths: Array<string> = [];
  public lineNumbers: Array<number> = [];
  public origionalCode: Array<string> = [];
  public mutatedCode: Array<string> = [];
  public passedTests: Array<number> = [];
  public failedTests: Array<number> = [];
  public mutationScores: Array<number> = [];

  public totalPassedTests: number;
  public totalFailedTests: number;
  public totalMutationScore: number;

  constructor () {
    this.sourceFilePath = (outputStore[0][0]["SRC_FILE_PATH"]);
    this.sourceFiles.push(outputStore[0][0]["SRC_FILE"]);
    this.runner = (outputStore[0][0]["RUNNER"]);
    this.runnerConfig = outputStore[0][0]["RUNNER_CONFIG"];

    for (let i = 0; i < Object.keys(outputStore).length; i++) {
      this.testFilePaths.push(outputStore[i]["testFilePath"]);
      this.lineNumbers.push(outputStore[i]["lineNumber"]);
      this.mutatedCode.push(outputStore[i]["mutatedCode"]);
      this.origionalCode.push(outputStore[i]["origionalCode"]);
      this.passedTests.push(outputStore[i]["numberOfPassedTests"]);
      this.failedTests.push(outputStore[i]["numberOfFailedTests"]);
      this.mutationScores.push(outputStore[i]["mutationScore"]);
    }
    this.totalMutationScore = this.getProgramTotalMutationScore(this.mutationScores);
    this.totalPassedTests = this.getSumOfArrayElements(this.passedTests);
    this.totalFailedTests = this.getSumOfArrayElements(this.failedTests);
    console.log(this);
  }

  public getProgramTotalMutationScore (mutationScores: Array<number>) {
    const totalScore = this.getSumOfArrayElements(mutationScores);
    if (mutationScores.length === 0 || totalScore === 0){
      return 0;
    } else {
      return totalScore / mutationScores.length;
    }
  }

  public getSumOfArrayElements (numberArray: Array<number>) {
    return numberArray.reduce((a, b) => a + b, 0);
  }
}
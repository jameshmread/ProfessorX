import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent{

  // way too many variables here, need to refactor into an object
  public importedData;
  public outputStore: Object;

  public runner: string;
  public runnerConfig: Object;
  public testFilePaths: Array<string> = [];

  // fields passed to other components
  public duration = [];
  public sourceFilePath: string;
  public sourceFiles: Array<string> = [];
  public mutatorResults: Array<boolean> = [];
  public survivingMutants: Array<Object> = [];

  public currentTab = "Dashboard";

  constructor () {
    this.importData();
    this.importOutputStores();
    console.log(this);
  }

  public async importData () {
      await import("./data.json").then((data) => {
        this.getDuration(data);
      });
  }

  public getDuration (data) {
    this.duration.push(data["d"]);
    this.duration.push(data["h"]);
    this.duration.push(data["m"]);
    this.duration.push(data["s"]);
    this.duration.push(data["ms"]);
  }

  public async importOutputStores () {
      await import("./outputStoreData.json").then((data) => {
        this.outputStore = data;
        this.setMutationInformation(this.outputStore);
      });
  }

  public getCurrentTab (event){
    this.currentTab = event;
  }

  private setMutationInformation (outputStore: Object) {
    this.sourceFilePath = (outputStore[0]["SRC_FILE_PATH"]);
    this.runner = (outputStore[0]["RUNNER"]);
    this.runnerConfig = outputStore[0]["RUNNER_CONFIG"];

    for (let i = 0; i < Object.keys(outputStore).length; i++) {
      if (this.sourceFiles.indexOf(outputStore[i]["SRC_FILE"]) < 0){
        this.sourceFiles.push(outputStore[i]["SRC_FILE"]);
      }
      if (outputStore[i]["mutantKilled"] === false){
        this.survivingMutants.push(outputStore[i]);
      }
      this.mutatorResults.push(outputStore[i]["mutantKilled"]);
    }
    console.log(this.survivingMutants);
  }
}

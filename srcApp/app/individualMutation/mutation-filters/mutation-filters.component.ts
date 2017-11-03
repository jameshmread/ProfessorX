import { Component, Input, OnInit } from "@angular/core";
import { SelectItem } from "primeng/primeng";
import { IPrimengDropdown } from "../../../../interfaces/IPrimengDropdown";

@Component({
  selector: "app-mutation-filters",
  templateUrl: "./mutation-filters.component.html",
  styleUrls: ["./mutation-filters.component.css"]
})


export class MutationFiltersComponent implements OnInit {

  @Input() public srcFiles: Array<string> = [];
  @Input() public mutators: Array<{mutatorName: string, mutatorDescription: string}> = [];

  public sourceFilesDropDown: Array<IPrimengDropdown> =
  [{label: "Select Source File", value: {id: -1, name: "Select"}}];
  public selectedSourceFile = "Select";

  public mutatorsDropdown: Array<IPrimengDropdown> =
  [{label: "Select Mutator", value: {id: -1, name: "Select"}}];
  public selectedMutator = "Select";

  constructor () { }

  public ngOnInit () {
    this.addSourceFileDropdownOptions();
  }

  public addSourceFileDropdownOptions () {
    for (let i = 0; i < this.srcFiles.length; i++) {
      this.sourceFilesDropDown.push(
        {
          label: this.srcFiles[i],
          value: {id: i, name: this.srcFiles[i]}
        });
    }
  }

}

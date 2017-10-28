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

  public sourceFiles: Array<IPrimengDropdown> =
  [{label: "Select Source File", value: {id: -1, name: "Select"}}];

  public selectedSourceFile = "Select";

  constructor () { }

  public ngOnInit () {
    for (let i = 0; i < this.srcFiles.length; i++) {
      this.sourceFiles.push(
        {
          label: this.srcFiles[i],
          value: {id: i, name: this.srcFiles[i]}
        });
    }
  }

}

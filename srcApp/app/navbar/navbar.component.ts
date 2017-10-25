import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {

  @Output() public currentTab = new EventEmitter<string>();

  public tabs: Array<string> = ["Dashboard", "In-Depth View"];

  constructor () { }

  public ngOnInit () {
  }

  public selectTab (navItem: string) {
    this.currentTab.emit(navItem);
  }

}

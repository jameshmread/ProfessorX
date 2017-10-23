import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { MutationStatsSummaryComponent } from "./mutation-stats-summary/mutation-stats-summary.component";
import { MutatedFilesSummaryComponent } from './mutated-files-summary/mutated-files-summary.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProgressBarComponent,
    MutationStatsSummaryComponent,
    MutatedFilesSummaryComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

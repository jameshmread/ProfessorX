import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {DropdownModule} from "primeng/primeng";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ProgressBarComponent } from "./dashboard/progress-bar/progress-bar.component";
import { MutationStatsSummaryComponent } from "./dashboard/mutation-stats-summary/mutation-stats-summary.component";
import { MutatedFilesSummaryComponent } from "./dashboard/mutated-files-summary/mutated-files-summary.component";
import { MutationFiltersComponent } from "./individualMutation/mutation-filters/mutation-filters.component";
import { CodeChangeDisplayComponent } from "./individualMutation/code-change-display/code-change-display.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProgressBarComponent,
    MutationStatsSummaryComponent,
    MutatedFilesSummaryComponent,
    MutationFiltersComponent,
    CodeChangeDisplayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DropdownModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

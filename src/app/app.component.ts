import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SppinerComponent } from "./component/sppiner/sppiner.component";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NgxSpinnerModule , SppinerComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "front-end";
}

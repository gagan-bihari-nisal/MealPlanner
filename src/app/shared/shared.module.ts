import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner/loading-spinner.component";
import { DropdownDirective } from "./dropdown.directive";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";

@NgModule({
    declarations:[
        AlertComponent,
        LoadingSpinnerComponent,
        DropdownDirective,
        PlaceholderDirective
    ],
    imports:[CommonModule],
    exports:[
        AlertComponent,
        LoadingSpinnerComponent,
        DropdownDirective,
        PlaceholderDirective,
        CommonModule
    ],
    entryComponents: [AlertComponent]

})
export class SharedModule{

}
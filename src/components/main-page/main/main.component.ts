import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AboutComponent} from "../about/about.component";
import {ComponentType, DescriptionComponent} from "../description/description.component";
import {FooterComponent} from "../footer/footer.component";
import {HeaderComponent} from "../header/header.component";
import {IntroductionComponent} from "../introduction/introduction.component";

@Component({
  selector: 'app-main',
    imports: [
        AboutComponent,
        DescriptionComponent,
        FooterComponent,
        HeaderComponent,
        IntroductionComponent
    ],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main.component.css'
})
export class MainComponent{

  protected readonly ComponentType = ComponentType;
}

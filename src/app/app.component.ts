import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import {CommonModule} from '@angular/common';
import {IntroductionComponent} from '../introduction/introduction.component';
import {AboutComponent} from '../about/about.component';
import {DescriptionComponent} from '../description/description.component';
import {ComponentType} from '../description/description.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    HeaderComponent,
    CommonModule,
    IntroductionComponent,
    AboutComponent,
    DescriptionComponent,
    FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pizzeria-spa';
}

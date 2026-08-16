import { Component, ChangeDetectionStrategy } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-introduction',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './introduction.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './introduction.component.css'
})
export class IntroductionComponent {

}

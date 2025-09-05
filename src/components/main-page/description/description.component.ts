import {Component, inject, Input, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatTooltipModule} from '@angular/material/tooltip';

export enum ComponentType {
  ItalianTaste,
  Mindfulness,
  Takeaway
}

@Component({
  selector: 'app-description',
  imports: [
    NgOptimizedImage,
    NgClass,
    MatButtonModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './description.component.html',
  styleUrl: './description.component.css'
})
export class DescriptionComponent implements OnInit {
  @Input({ required: true }) imageFirst!: boolean;
  @Input({ required: true }) componentType!: ComponentType;

  protected readonly ComponentType = ComponentType;
  private readonly authService = inject(AuthenticationService);

  headingText: string = "";
  paragraphText: string = "";
  imageSource: string = "";

  ngOnInit() {
    switch (this.componentType) {
      case ComponentType.ItalianTaste: {
        this.imageSource = "images/spices.png";
        this.headingText = "OLASZ ÍZEK";
        this.paragraphText = "A pizzák minden esetben magas minőségű olasz alapanyagokból készülnek." +
          " Hiszem, hogy a minőség a legfontosabb egy ételnél, amire magas hangsúlyt fektetek minden egyes pizza elkészítésénél.";

        break;
      }
      case ComponentType.Mindfulness: {
        this.imageSource = "images/mindfulness.png";
        this.headingText = "TUDATOSSÁG";
        this.paragraphText = "Az étlap összeállításánál törekedtem arra, hogy csak a legfontosabbak kerüljenek fel oda." +
          " Nincs 50 fajta pizza, viszont az a kevés, ami van, garantáltan ízletes és egyedi lesz.";

        break;
      }
      case ComponentType.Takeaway: {
        this.imageSource = "images/takeaway.png";
        this.headingText = "ELVITEL";
        this.paragraphText = "Elegendő a rendelést online, vagy telefonon leadni." +
          " Telefonos rendelés esetén az alábbi telefonszámon érdeklődhet: +421917275784. " +
          "Online rendelését pedig az alábbi gombra kattintva adhatja le.";

        break;
      }
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.getToken() !== null;
  }

  get userFirstName(): string | null {
    return this.isLoggedIn ? this.authService.getUserFirstName() : null;
  }
}

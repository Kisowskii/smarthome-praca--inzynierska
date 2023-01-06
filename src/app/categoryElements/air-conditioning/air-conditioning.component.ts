import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { MainMenuPageComponent } from 'src/app/main-menu-page/main-menu-page.component';
import { CategoryElementsService } from '../category-elements.service';


@Component({
  selector: 'app-air-conditioning',
  template: `
  <app-template-element title="Klimatyzacja" [type]="'Klimatyzacja'"  [showOptionAutomaticElement]="true"></app-template-element>
  `,
})
export class AirConditioningComponent {

  constructor(public elementService: CategoryElementsService) {}
  
}
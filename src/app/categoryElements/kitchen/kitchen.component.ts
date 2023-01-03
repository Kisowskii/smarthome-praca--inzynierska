import { Component } from '@angular/core';

@Component({
  selector: 'app-kitchen',
  template: `
  <app-template-element title="Kuchnia" [position]="'Kuchnia'" [showOptionAutomaticElement]="true"></app-template-element>
  `,
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent {
}

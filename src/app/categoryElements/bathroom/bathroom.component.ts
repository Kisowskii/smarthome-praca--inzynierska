import { Component } from '@angular/core';

@Component({
  selector: 'app-bathroom',
  template: `
  <app-template-element title="Łazienka" [position]="'Łazienka'"  [showOptionAutomaticElement]="true"></app-template-element>
  `,
})
export class BathroomComponent {
}

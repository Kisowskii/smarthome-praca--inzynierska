import { Component } from '@angular/core';

@Component({
  selector: 'app-living-room',
  template: `
  <app-template-element title="Salon" [position]="'Salon'" [showOptionAutomaticElement]="true"></app-template-element>
  `,
})
export class LivingRoomComponent {
}

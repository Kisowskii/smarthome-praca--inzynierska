import { Component } from '@angular/core';

@Component({
  selector: 'app-living-room',
  template: `
  <app-template-element title="Salon" [position]="'Salon'" [showOptionAutomaticElement]="true"></app-template-element>
  `,
  styleUrls: ['./living-room.component.scss']
})
export class LivingRoomComponent {
}

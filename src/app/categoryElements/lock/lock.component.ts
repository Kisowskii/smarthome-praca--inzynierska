import { Component } from '@angular/core';

@Component({
  selector: 'app-living-room',
  template: `
  <app-template-element title="Zamek" [type]="'Zamek'" [showOptionAutomaticElement]="false"></app-template-element>
  `,
})
export class LockComponent {
}

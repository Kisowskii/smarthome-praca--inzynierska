import { Component } from '@angular/core';

@Component({
  selector: 'app-shutters',
  template: `
  <app-template-element title="Rolety" [type]="'Rolety'" [showOptionAutomaticElement]="true"></app-template-element>
  `,
})
export class ShuttersComponent {
}

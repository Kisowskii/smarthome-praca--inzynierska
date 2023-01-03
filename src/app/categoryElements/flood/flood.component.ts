import { Component } from '@angular/core';

@Component({
  selector: 'app-flood',
  template: `
  <app-template-element title="Wykrycie zalania" [type]="'Zalanie'" [showOptionAutomaticElement]="false"></app-template-element>
  `,
  styleUrls: ['./flood.component.scss']
})
export class FloodComponent {
}

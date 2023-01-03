import { Component } from '@angular/core';

@Component({
  selector: 'app-smoke',
  template: `
  <app-template-element title="Wykrycie zadymienia" [showOptionAutomaticElement]="false"  [type]="'Zadymienie'"></app-template-element>
  `,
  styleUrls: ['./smoke.component.scss']
})
export class SmokeComponent {
  
}

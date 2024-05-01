import { Component } from '@angular/core';

@Component({
  selector: 'app-light',
  template: `
    <app-template-element title="Oświetlenie" [type]="'Oswietlenie'" [showOptionAutomaticElement]="true"></app-template-element>
  `,
})
export class LightComponent {}

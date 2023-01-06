import { Component } from '@angular/core';

@Component({
  selector: 'app-temperature',
  template: `
  <app-template-element title="Temperatura w °C" [showOptionAutomaticElement]="false" [type]="'Temperatura'"></app-template-element>
  `,
})
export class TemperatureComponent {

}

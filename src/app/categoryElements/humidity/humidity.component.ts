import { Component } from '@angular/core';

@Component({
  selector: 'app-humidity',
  template: `
  <app-template-element title="Stopień wilgotności w %" [type]="'Wilgotność'" [showOptionAutomaticElement]="false"></app-template-element>
  `,
})
export class HumidityComponent{
  
}

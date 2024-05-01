import { Component } from '@angular/core';

@Component({
  selector: 'app-bedroom',
  template: `
    <app-template-element title="Sypialnia" [position]="'Sypialnia'" [showOptionAutomaticElement]="true"></app-template-element>
  `,
})
export class BedroomComponent {}

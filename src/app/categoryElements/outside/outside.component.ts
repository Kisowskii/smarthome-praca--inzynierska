import { Component } from '@angular/core';

@Component({
  selector: 'app-outside',
  template: `
  <app-template-element title="Elementy na zewnątrz" [position]="'Na zewnatrz'"   [showOptionAutomaticElement]="true"></app-template-element>
  `,
})
export class OutsideComponent {
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-outside',
  template: `
  <app-template-element title="Elementy na zewnątrz" [position]="'Na zewnątrz'"   [showOptionAutomaticElement]="true"></app-template-element>
  `,
  styleUrls: ['./outside.component.scss']
})
export class OutsideComponent {
}

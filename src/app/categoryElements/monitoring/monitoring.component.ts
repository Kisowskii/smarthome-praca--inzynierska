import { Component } from '@angular/core';

@Component({
  selector: 'app-monitoring',
  template: `
  <app-template-element title="Monitoring" [type]="'Monitoring'" [showOptionAutomaticElement]="true"></app-template-element>
  `,
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent {
  
}

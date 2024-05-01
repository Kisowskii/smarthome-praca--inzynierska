import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryElementsService } from 'src/app/categoryElements/category-elements.service';

@Component({
  selector: 'app-charts-dialog',
  template: `
    <div class="dialog-header dark-background">
      <h2>Wykresy aktywności</h2>
      <button mat-icon-button class="close-button" mat-dialog-close>
        <mat-icon aria-label="Zamknij okno modalne">close</mat-icon>
      </button>
    </div>
    <mat-dialog-content>
      <div *ngFor="let chart of chartsTransformed">
        <h3>{{ chart.title }}</h3>
        <!-- Wyświetlenie tytułu -->
        <div #chartContainer class="chart-container">
          <ngx-charts-bar-vertical
            [view]="view"
            [results]="chart.data"
            [gradient]="true"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="false"
            [showXAxisLabel]="true"
            [showYAxisLabel]="true"
            [xAxisTickFormatting]="xAxisTickFormatting"
            xAxisLabel="Godzina"
            yAxisLabel="Ilość uruchomień"
          ></ngx-charts-bar-vertical>
        </div>
      </div>
    </mat-dialog-content>
  `,
  styleUrls: ['./styles/charts-dialog.component.scss'],
})
export class ChartsDialogComponent implements OnInit {
  colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] }; // Dostosuj kolory do stylów projektu
  chartsTransformed: any[] = [];
  @ViewChild('chartContainer') chartContainer: ElementRef;
  view: [number, number]; // Wymiary wykresu

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elementService: CategoryElementsService,
  ) {}

  ngOnInit(): void {
    this.elementService.getAllElements().subscribe((elements) => {
      this.chartsTransformed = this.data.charts.map((chart: any) => {
        const element = elements.find((el: any) => el._id === chart.deviceId);
        const title = element ? `${element.elementType} ${element.elementPosition}` : 'Nieznane urządzenie';

        return {
          title, // Dodajemy tytuł
          data: chart.data.map((item: any) => ({
            name: `${item.hour}h`,
            value: item.state,
          })),
        };
      });
    });
    this.updateChartDimensions();
  }

  xAxisTickFormatting = (val: any) => {
    val = val.slice(0, -1);
    return `${val}`;
  };

  updateChartDimensions() {
    if (this.chartContainer && this.chartContainer.nativeElement) {
      const width = this.chartContainer.nativeElement.offsetWidth;
      const height = this.chartContainer.nativeElement.offsetHeight || 300; // Domyślna wysokość, jeśli potrzebujesz
      this.view = [width, height];
    }
  }

  // Nasłuchiwanie na zmianę rozmiaru okna
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateChartDimensions();
  }
}

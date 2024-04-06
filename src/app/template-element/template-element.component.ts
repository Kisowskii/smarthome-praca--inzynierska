import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CategoryElementsService } from '../categoryElements/category-elements.service';
import { VideoModalComponent } from '../categoryElements/monitoring/modal/camera.moda.component';

@Component({
  selector: 'app-template-element',
  template: `
    <div class="template-container">
      <div class="top-panel">
        <div class="first-row">
          <button aria-label="Strzałka wstecz" class="arrow-button" role="button" routerLink="..">
            <img class='arrow' src="../../assets/Strzalka-wstecz.svg">
          </button>
          <div class="title">{{ title }}</div>
        </div>
        <div class="second-row" *ngIf="showOptionAutomaticElement" [ariaLabel]="">
          <mat-slide-toggle color="primary"  
                            [checked]="automationChecked"
                            (change)="onChangeSwitcherInformations()"
                            [aria-label]="typeOfSwitherInformations"> 
          </mat-slide-toggle>{{ typeOfSwitherInformations }}
        </div>
      </div>
      <div class="content-panel" *ngFor="let element of elements">
        <div class="information-panel">
          <div class="icon-container"><img [src]="element.icon"></div> 
          <div class="title-container" *ngIf="type">{{ element.elementPosition }}</div>
          <div class="title-container" *ngIf="position">{{ element.buttonText }}</div>
          <div class='monitoring' role="button" *ngIf="title=='Monitoring' && element.value === true">
            <button mat-raised-button color="primary" (click)="openCameraPreview()">Podgląd</button>
          </div>
          <div class="value-container" *ngIf="onCheckValueIsStringOrNumer(element.value)">{{ element.value }}</div>
          <div class="value-container" *ngIf="onCheckValueIsBoolean(element.value)">
            <mat-slide-toggle [aria-label]="element.elementType + element.elementPosition"
                              (click)="onUpdateElement(element)"
                              color="primary"
                              [checked]="element.value"
                              [disabled]="automationChecked">
            </mat-slide-toggle>
          </div>
        </div>
        <hr>
      </div>
    </div>
  `,
  styleUrls: ['./template-element.component.scss']
})
export class TemplateElementComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() elements: MainMenuCategoryDtos[] = [];
  @Input() showOptionAutomaticElement: boolean = true;
  @Input() type: string = '';
  @Input() position: string = '';
  typeOfSwitherInformations: string = 'Włącz automatyczne sterowanie';
  automationChecked: boolean = true;
  elementSub: Subscription;

  constructor(public elementService: CategoryElementsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.type) {
      this.elementService.getElementsByType(this.type);
    } else {
      this.elementService.getElementsByPosition(this.position);
    }

    this.elementSub = this.elementService.getElementUpdateListener().subscribe((elements: MainMenuCategoryDtos[]) => {
      this.elements = elements;
      elements.forEach((element) => (this.automationChecked = element.automation));
    });
  }

  ngOnDestroy(): void {
    this.elementSub.unsubscribe();
  }

  onChangeSwitcherInformations(): void {
    this.automationChecked = !this.automationChecked;
    this.typeOfSwitherInformations = this.automationChecked ? 'Włącz manualne sterowanie' : 'Włącz automatyczne sterowanie';
    this.elements.forEach((element) => {
      this.elementService.updateElement(element._id, element.buttonText, element.elementType, element.elementPosition, element.icon, element.value, this.automationChecked);
    });
  }

  onCheckValueIsBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  onCheckValueIsStringOrNumer(value: any): boolean {
    return typeof value === 'string' || typeof value === 'number';
  }

  onUpdateElement(element: MainMenuCategoryDtos): void {
    element.value = !element.value;
    this.elementService.updateElement(element._id, element.buttonText, element.elementType, element.elementPosition, element.icon, element.value, element.automation);
  }

   openCameraPreview(): void {
    this.dialog.open(VideoModalComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      autoFocus: true,
      data: {}
    });
  }
}

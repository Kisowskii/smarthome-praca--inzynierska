import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryElementsService } from '../categoryElements/category-elements.service';

@Component({
  selector: 'app-template-element',
  template: `
  <div class="template-container">
    <div class="top-panel">
      <div class="first-row">
         <button class="arrow-button" role="button" routerLink=".."><img class='arrow'  src="../../assets/Strzalka-wstecz.svg"> </button>
         <div class="title">{{title}}</div>
      </div>
      <div class="second-row" *ngIf="showOptionAutomaticElement">
        <mat-slide-toggle color="primary"  
        [checked]="automationChecked"
        (change)="onChangeSwitcherInformations()"> 
        </mat-slide-toggle>{{typeOfSwitherInformations}}
      </div>
    </div>
    <div class="content-panel" *ngFor="let element of elements">
      <div class="information-panel">
        <div class="icon-container"><img [src]="element.icon"></div> 
        <div class="title-container" *ngIf="type">{{element.elementPosition}}</div>
        <div class="title-container" *ngIf="position">{{element.buttonText}}</div>
        <div class='monitoring' role="button" *ngIf="title=='Monitoring'"><button mat-raised-button color="primary">Podgląd</button></div>
        <div class="value-container" *ngIf="onCheckValueIsStringOrNumer(element.value)">{{element.value}}</div>
        <div class="value-container" *ngIf="onCheckValueIsBoolean(element.value)">
        <mat-slide-toggle (click)="onUpdateElement(element)" color="primary" [checked]="element.value"  [disabled]="automationChecked" >
      </mat-slide-toggle>
        </div>
      </div>
      <hr>
    </div>
  </div>
  `,
  styleUrls: ['./template-element.component.scss']
})
export class TemplateElementComponent implements OnInit {
  @Input () title: string = '';
  @Input () elements: MainMenuCategoryDtos[] = [];
  @Input () showOptionAutomaticElement:boolean=true;
  @Input () type:string;
  @Input () position:string;
  typeOfSwitherInformations:string =`Włącz automatyczne sterowanie`
  elementSub:Subscription
  automationChecked:boolean = true;
  elementAutomationValue = []

  constructor(public elementService: CategoryElementsService) {}
  
  ngOnInit(){
    if(this.type){
      this.elementService.getElementsByType(this.type)
    }
    else{
      this.elementService.getElementsByPosition(this.position)
    }
    this.elementSub = this.elementService
      .getElementUpdateListener()
      .subscribe((elements: MainMenuCategoryDtos[]) => {
        this.elements = elements
        elements.forEach((element)=> element.automation === false ?  this.automationChecked = false : this.automationChecked = true)
      });
  }

  ngOnDestroy() {
    this.elementSub.unsubscribe();
  }

  onChangeSwitcherInformations(){
    this.automationChecked=!this.automationChecked
    if (this.automationChecked){
      this.typeOfSwitherInformations=`Włącz manualne sterowanie`
    }
    else {
      this.typeOfSwitherInformations=`Włącz automatyczne sterowanie`
    }
    this.elements.forEach((element)=>{
      this.elementService.updateElement(  element._id, element.buttonText, element.elementType, element.elementPosition, element.icon, element.value, this.automationChecked
        )
    })
  }
  onCheckValueIsBoolean(value:any){
    if(typeof value == 'boolean'){
      return true;
    }
    return false;
  }
  onCheckValueIsStringOrNumer(value:any){
    if(typeof value == 'string' || typeof value == 'number'){
      return true;
    }
    return false;
  }

  onUpdateElement(element:MainMenuCategoryDtos){
    element.value = !element.value;
    this.elementService.updateElement(  element._id, element.buttonText, element.elementType, element.elementPosition, element.icon, element.value, element.automation
      ) 
  }
}

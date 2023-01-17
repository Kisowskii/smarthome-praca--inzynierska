import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-main-menu-page',
  template: `
 <div class="main-menu-container">
    <div class="main-menu-header">
      <h2>Twoje elementy</h2>
    </div>
    <mat-slide-toggle
          color="primary"
          [checked]="checked"
          (change)="onChangeDisplayInformations()">
        {{typeOfSwitherInformations}}
      </mat-slide-toggle>
    <div class="table-container"  *ngFor="let category of typeCategories">
      <button [attr.aria-label]="category.elementType" class="main-menu-single-panel" role="button" *ngIf="!checked" [routerLink]="category.elementType"><img [src]="category.icon" alt="Ikona + {{category.buttonText}}">{{category.buttonText}} <img class='arrow'  src="../../assets/Strzalka.svg"></button>
    </div>
    <div class="table-container"  *ngFor="let category of positionCategories">
      <button [attr.aria-label]="category.elementPosition" class="main-menu-single-panel" role="button" *ngIf="checked" [routerLink]="category.elementPosition"><img [src]="category.icon" alt="Ikona + {{category.buttonText}}">{{category.buttonText}} <img class='arrow'  src="../../assets/Strzalka.svg"></button>
    </div>
  </div>
  `,
  styleUrls: ['./main-menu-page.component.scss']
})
export class MainMenuPageComponent {

  checked
  typeOfSwitherInformations:string ='Wyświetl element według rozmieszczenia'
  menuType:string = ''

  onChangeDisplayInformations(){
    this.menuType = 'menu/Types'
    this.checked=!this.checked
    if (this.checked){
      this.typeOfSwitherInformations="Wyświetl element według przeznaczenia"
    }
    else {
        this.typeOfSwitherInformations="Wyświetl element według rozmieszczenia"
    }
  }

  

  typeCategories:MainMenuCategoryDtos[] = [
    {buttonText:'Oświetlenie', elementType:'oswietlenie',icon:"../../assets/Oswietlenie.svg"},
    {buttonText:'Temperatura', elementType:'temperatura', icon:"../../assets/Temperatura.svg"},
    {buttonText:'Czujniki dymu', elementType:'zadymienie', icon:"../../assets/Czujnik_Dymu.svg"},
    {buttonText:'Monitoring', elementType:'monitoring', icon:"../../assets/Monitoring.svg"},
    {buttonText:'Rolety', elementType:'rolety', icon:"../../assets/Rolety.svg"},
    {buttonText:'Wilgotność', elementType:'wilgotnosc', icon:"../../assets/Wilgotnosc.svg"},
    {buttonText:'Czujniki Zalania', elementType:'zalanie', icon:"../../assets/Czujnik_Zalania.svg"},
    {buttonText:'Klimatyzacja', elementType:'klimatyzacja', icon:"../../assets/Oswietlenie.svg"},
  ]
  positionCategories:MainMenuCategoryDtos[] = [
    {buttonText:'Kuchnia', elementPosition:'kuchnia', icon:"../../assets/Oswietlenie.svg"},
    {buttonText:'Salon', elementPosition:'salon', icon:"../../assets/Temperatura.svg"},
    {buttonText:'Sypialnia', elementPosition:'sypialnia', icon:"../../assets/Czujnik_Dymu.svg"},
    {buttonText:'Łazienka', elementPosition:'lazienka', icon:"../../assets/Monitoring.svg"},
    {buttonText:'Elementy zewnętrzne', elementPosition:'elementy-zewnetnrze', icon:"../../assets/Rolety.svg"},
  ]

 
}

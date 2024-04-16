import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { SettingsService } from './settings.service';
import { ChartsDialogComponent } from './modals/chart-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FaceIdModalComponent } from './modals/faceIdGenerator.modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-main-menu-page',
  template: `
 <div class="main-menu-container">

    <div class="menu-container light-background">
      <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Menu opcji">
        <mat-icon class="text-dark">menu</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="showCharts()">Pokaż wykresy</button>
        <button mat-menu-item [routerLink]="'/signup'">Dodaj użytkownika</button>
        <button mat-menu-item (click)="updateAIModel()">Aktualizuj model AI</button>
        <button mat-menu-item (click)="faceIdScanning()">Zeskanuj swoją twarz</button>
        <button mat-menu-item (click)="logout()">Wyloguj</button>
      </mat-menu>
    </div>

    <div class="main-menu-header">
      <h2>Twoje elementy</h2>
    </div>
    <div class="settings-container">
      <mat-slide-toggle
            color="primary"
            [checked]="checked"
            (change)="onChangeDisplayInformations()">
          {{typeOfSwitherInformations}}
        </mat-slide-toggle>
        <mat-slide-toggle
          color="primary"
          [checked]="AiEnabled"
          (change)="toggleAi($event.checked)">
          Włącz sztuczną inteligencję
        </mat-slide-toggle>
    </div>
    <div class="table-container"  *ngFor="let category of typeCategories">
      <button [attr.aria-label]="category.elementType" class="main-menu-single-panel dark-border-button" role="button" *ngIf="!checked" [routerLink]="category.elementType"><img [src]="category.icon" alt="Ikona + {{category.buttonText}}">{{category.buttonText}} <img class='arrow'  src="../../assets/Strzalka.svg " aria-label="Przejdź do elementu"></button>
    </div>
    <div class="table-container"  *ngFor="let category of positionCategories">
      <button [attr.aria-label]="category.elementPosition" class="main-menu-single-panel dark-border-button" role="button" *ngIf="checked" [routerLink]="category.elementPosition"><img [src]="category.icon" alt="Ikona + {{category.buttonText}}">{{category.buttonText}} <img class='arrow'  src="../../assets/Strzalka.svg" aria-label="Przejdź do elementu"></button>
    </div>
  </div>
  `,
  styleUrls: ['./main-menu-page.component.scss']
})
export class MainMenuPageComponent implements OnInit {
  constructor(private renderer: Renderer2, public authService: AuthService, private router: Router, public settingsService:SettingsService, public dialog: MatDialog, private snackBar: MatSnackBar, private el: ElementRef) {}
  checked
  typeOfSwitherInformations:string ='Wyświetl element według rozmieszczenia'
  menuType:string = ''
  AiEnabled: boolean = false;
  userId = localStorage.getItem('userId');

  ngOnInit(): void {
    this.settingsService.fetchSettings(this.userId).subscribe((settings)=>{
      const aiEnabledSetting = settings.find(setting => setting.name === 'aiEnabled');
      const checkedSetting = settings.find(setting => setting.name === 'checked');

    // Przypisuje wartości tylko jeśli znaleziono odpowiednie ustawienia
      if (aiEnabledSetting) {
      this.AiEnabled = aiEnabledSetting.enabled;
      }
      if (checkedSetting) {
      this.checked = checkedSetting.enabled;
     }
    })
  }
  
  toggleAi(isEnabled: boolean) {
   this.AiEnabled = isEnabled;
   this.settingsService.updateSetting(this.userId, 'aiEnabled', isEnabled).subscribe();
 }

  onChangeDisplayInformations(){
    this.menuType = 'menu/Types'
    this.checked=!this.checked
    this.settingsService.updateSetting(this.userId, 'checked', this.checked).subscribe();
    if (this.checked){
      this.typeOfSwitherInformations="Wyświetl element według przeznaczenia"
    }
    else {
        this.typeOfSwitherInformations="Wyświetl element według rozmieszczenia"
    }
  }


  logout() {
    this.authService.logout();
  }
  
  updateAIModel() {
    this.settingsService.updateAiModel().subscribe({
      next: (response) => {
        this.snackBar.open('Model AI został zaktualizowany.', 'Zamknij', {
          duration: 120000,
          panelClass: 'custom-snackbar'
        });
      },
      error: (error) => {
        this.snackBar.open('Wystąpił błąd podczas aktualizacji modelu AI.', 'Zamknij', {
          duration: 120000,
          panelClass: 'custom-snackbar'
        });
      }
    });
  }

  faceIdScanning(){
    this.dialog.open(FaceIdModalComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      autoFocus: true,
      data: {},
      ariaLabel:'Okno modalne do skanowania twarzy'
    });
    const appRoot = this.el.nativeElement.closest('app-root');
    
    if (appRoot) {
      this.renderer.removeAttribute(appRoot, 'aria-hidden');
      this.renderer.removeAttribute(appRoot, 'tabindex');
    }
  }
  

  showCharts() {
    this.settingsService.fetchChartData().subscribe(chartData => {
      this.openChartsDialog(chartData);
    });
  }

  openChartsDialog(chartsData: any) {
    this.dialog.open(ChartsDialogComponent, {
      width: '100vw', // Szerokość na 100% viewport width
      height: '100vh', // Wysokość na 100% viewport height
      maxWidth: '100vw', // Maksymalna szerokość na 100% viewport width
      minWidth: '100vw', // Maksymalna szerokość na 100% viewport width
      maxHeight: '100vh', // Maksymalna wysokość na 100% viewport height
      minHeight: '100vh', // Maksymalna wysokość na 100% viewport height
      data: { charts: chartsData },
      ariaLabel:'Okno modalne z wykresami przedstawiającymi zwyczaje użytkowników'
    });
    const appRoot = this.el.nativeElement.closest('app-root');
    
    if (appRoot) {
      this.renderer.removeAttribute(appRoot, 'aria-hidden');
      this.renderer.removeAttribute(appRoot, 'tabindex');
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

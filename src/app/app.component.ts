import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smarthome';

  constructor(private renderer: Renderer2) {}

  changeFontSize(size: 'small' | 'medium' | 'large') {
    // Usuń wcześniej ustawione klasy (jeśli istnieją)
    this.renderer.removeClass(document.body, 'font-size-small');
    this.renderer.removeClass(document.body, 'font-size-medium');
    this.renderer.removeClass(document.body, 'font-size-large');
    // Dodaj nową klasę bazującą na wyborze użytkownika
    this.renderer.addClass(document.body, `font-size-${size}`);
  }

  toggleContrast() {
    // Sprawdź, czy klasa kontrastu jest już ustawiona
    if (document.body.classList.contains('high-contrast')) {
      this.renderer.removeClass(document.body, 'high-contrast');
    } else {
      this.renderer.addClass(document.body, 'high-contrast');
    }
  }
}

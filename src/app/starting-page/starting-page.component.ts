import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-starting-page',
  template: `
  <div class="starting-page-container">
    <div role="button" class="button-logo">
       <svg width="48" height="54" viewBox="0 0 48 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 49.5H15.75V30.75H32.25V49.5H43.5V20.25L24 5.625L4.5 20.25V49.5ZM0 54V18L24 0L48 18V54H27.75V35.25H20.25V54H0Z" fill="white"/>
      </svg>
    </div>
    <h1>Smart Home</h1>
    <h3>Konrad Wisowski</h3>
    <div class="loader"></div>
  </div>
  `,
  styleUrls: ['./starting-page.component.scss']
})
export class StartingPageComponent  {
  constructor(private router: Router) {}


  ngOnInit() {
    setTimeout(() => {
        this.router.navigateByUrl("menu");
    }, 5000);  //5s
}
}

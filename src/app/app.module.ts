import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { AppRoutingModule } from './app-routing.module';
import { Router } from '@angular/router';
import { MainMenuPageComponent } from './main-menu-page/main-menu-page.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LightComponent } from './categoryElements/light/light.component';
import { TemperatureComponent } from './categoryElements/temperature/temperature.component';
import { SmokeComponent } from './categoryElements/smoke/smoke.component';
import { MonitoringComponent } from './categoryElements/monitoring/monitoring.component';
import { ShuttersComponent } from './categoryElements/shutters/shutters.component';
import { HumidityComponent } from './categoryElements/humidity/humidity.component';
import { FloodComponent } from './categoryElements/flood/flood.component';
import { AirConditioningComponent } from './categoryElements/air-conditioning/air-conditioning.component';
import { TemplateElementComponent } from './template-element/template-element.component';
import { KitchenComponent } from './categoryElements/kitchen/kitchen.component';
import { BathroomComponent } from './categoryElements/bathroom/bathroom.component';
import { LivingRoomComponent } from './categoryElements/living-room/living-room.component';
import { OutsideComponent } from './categoryElements/outside/outside.component';
import { BedroomComponent } from './categoryElements/bedroom/bedroom.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { WebcamModule } from 'ngx-webcam';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthModule } from './auth/auth.module';
import { ChartsDialogComponent } from './main-menu-page/modals/chart-dialog.component';
import { VideoModalComponent } from './categoryElements/monitoring/modal/camera.moda.component';
import { FaceIdModalComponent } from './main-menu-page/modals/faceIdGenerator.modal.component';
import { LockComponent } from './categoryElements/lock/lock.component';

@NgModule({
  declarations: [
    AppComponent,
    StartingPageComponent,
    MainMenuPageComponent,
    LightComponent,
    TemperatureComponent,
    SmokeComponent,
    MonitoringComponent,
    ShuttersComponent,
    HumidityComponent,
    FloodComponent,
    AirConditioningComponent,
    TemplateElementComponent,
    KitchenComponent,
    BathroomComponent,
    LivingRoomComponent,
    OutsideComponent,
    BedroomComponent,
    LockComponent,
    ChartsDialogComponent,
    VideoModalComponent,
    FaceIdModalComponent,
  ],
  imports: [AuthModule, WebcamModule, HttpClientModule, BrowserModule, AppRoutingModule, MatSlideToggleModule, MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule, BrowserAnimationsModule, NgxChartsModule],

  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {}
}

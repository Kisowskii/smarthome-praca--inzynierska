import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartingPageComponent } from './starting-page/starting-page.component';
import {RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';
import { MainMenuPageComponent } from './main-menu-page/main-menu-page.component';
import { AirConditioningComponent } from './categoryElements/air-conditioning/air-conditioning.component';
import { FloodComponent } from './categoryElements/flood/flood.component';
import { HumidityComponent } from './categoryElements/humidity/humidity.component';
import { LightComponent } from './categoryElements/light/light.component';
import { MonitoringComponent } from './categoryElements/monitoring/monitoring.component';
import { ShuttersComponent } from './categoryElements/shutters/shutters.component';
import { SmokeComponent } from './categoryElements/smoke/smoke.component';
import { TemperatureComponent } from './categoryElements/temperature/temperature.component';
import { KitchenComponent } from './categoryElements/kitchen/kitchen.component';
import { LivingRoomComponent } from './categoryElements/living-room/living-room.component';
import { BathroomComponent } from './categoryElements/bathroom/bathroom.component';
import { BedroomComponent } from './categoryElements/bedroom/bedroom.component';
import { OutsideComponent } from './categoryElements/outside/outside.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', component: StartingPageComponent },
  { path: 'menu', component: MainMenuPageComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/types', component: MainMenuPageComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/oswietlenie', component: LightComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/klimatyzacja', component: AirConditioningComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/zalanie', component: FloodComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/wilgotnosc', component: HumidityComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/monitoring', component: MonitoringComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/rolety', component: ShuttersComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/zadymienie', component: SmokeComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/temperatura', component: TemperatureComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/kuchnia', component: KitchenComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/salon', component: LivingRoomComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/lazienka', component: BathroomComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/sypialnia', component: BedroomComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  { path: 'menu/elementy-zewnetnrze', component: OutsideComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false, // <-- debugging purposes only
      preloadingStrategy: SelectivePreloadingStrategyService,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

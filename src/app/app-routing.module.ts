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

const appRoutes: Routes = [
  { path: '', component: StartingPageComponent },
  { path: 'menu', component: MainMenuPageComponent},
  { path: 'menu/types', component: MainMenuPageComponent},
  { path: 'menu/oswietlenie', component: LightComponent },
  { path: 'menu/klimatyzacja', component: AirConditioningComponent },
  { path: 'menu/zalanie', component: FloodComponent },
  { path: 'menu/wilgotnosc', component: HumidityComponent },
  { path: 'menu/monitoring', component: MonitoringComponent },
  { path: 'menu/rolety', component: ShuttersComponent },
  { path: 'menu/zadymienie', component: SmokeComponent },
  { path: 'menu/temperatura', component: TemperatureComponent },
  { path: 'menu/kuchnia', component: KitchenComponent },
  { path: 'menu/salon', component: LivingRoomComponent },
  { path: 'menu/lazienka', component: BathroomComponent },
  { path: 'menu/sypialnia', component: BedroomComponent },
  { path: 'menu/elementy-zewnetnrze', component: OutsideComponent },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false, // <-- debugging purposes only
      preloadingStrategy: SelectivePreloadingStrategyService,
    }),
    RouterModule.forChild(appRoutes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

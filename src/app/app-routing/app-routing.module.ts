import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { CityComponent } from "../city/city.component";

const appRoutes:Routes = <Routes>[
  {path: 'home', component: HomeComponent},
  {path: 'city', component: CityComponent},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}

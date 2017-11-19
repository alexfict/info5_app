import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "../home/home.component";
import {CityComponent} from "../city/city.component";
import {NavigationComponent} from "../navigation/navigation.component";
import {HelpComponent} from "../help/help.component"
import {AppComponent} from "../app.component";

const appRoutes: Routes = <Routes>[
    {path: 'home', component: HomeComponent},
    {path: 'city', component: CityComponent},
    {path: 'help', component: HelpComponent},
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

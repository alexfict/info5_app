import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "../home/home.component";
import {CityComponent} from "../city/city.component";
import {NavigationComponent} from "../navigation/navigation.component";
import {ParkingElementsComponent} from "../parking-elements/parking-elements.component"
import {HelpComponent} from "../help/help.component"
import {AppComponent} from "../app.component";
import {SessionResolver} from "../resolvers/session.resolver";
import {SignInComponent} from '../sign-in/sign-in.component';

const appRoutes: Routes = <Routes>[
    {path: 'home', component: HomeComponent},
    {path: 'city', component: CityComponent, resolve:{session:SessionResolver}},
    {path: 'help', component: HelpComponent},
    {path: 'signin', component: SignInComponent},
    {path: 'parkingelements/:id', component: ParkingElementsComponent, resolve:{session:SessionResolver}},
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

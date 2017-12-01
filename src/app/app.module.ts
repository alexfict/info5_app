/** modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

/** components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CityComponent } from './city/city.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HelpComponent } from './help/help.component';

/** services */
import { ParkingDataService } from './parking-data.service';
import { InMemoryDataService } from './in-memory-data.service';
import { DataExchangeService } from "./data-exchange.service";

/** resolvers */
import { SessionResolver } from './resolvers/session.resolver';
import { ParkingElementsComponent } from './parking-elements/parking-elements.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CityComponent,
    NavigationComponent,
    HelpComponent,
    ParkingElementsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    //InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule,
    LeafletModule.forRoot()
  ],
  providers: [
    ParkingDataService,
    DataExchangeService,
    SessionResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

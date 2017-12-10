/** modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';


/** components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CityComponent } from './city/city.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HelpComponent } from './help/help.component';

/** services */
import { ParkingDataService } from './parking-data.service';
import { InMemoryDataService } from './in-memory-data.service';

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
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    //InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule,
    LeafletModule.forRoot(),
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule
  ],
  providers: [
    ParkingDataService,
    SessionResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

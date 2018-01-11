/** modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

/** components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CityComponent } from './city/city.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HelpComponent } from './help/help.component';
import { ParkingElementsComponent } from './parking-elements/parking-elements.component';
import { PoiSearchComponent } from './poi-search/poi-search.component';

/** services */
import { ParkingDataService } from './parking-data.service';
import { InMemoryDataService } from './in-memory-data.service';
import { PoiService } from './poi.service';

/** resolvers */
import { SessionResolver } from './resolvers/session.resolver';

/** directives */
import { MapHostDirective } from './map-host.directive';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CityComponent,
    NavigationComponent,
    HelpComponent,
    ParkingElementsComponent,
    MapHostDirective,
    PoiSearchComponent
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
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    ParkingDataService,
    SessionResolver,
    PoiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

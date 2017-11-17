/** modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

/** components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CityComponent } from './city/city.component';

/** services */
import { ParkingDataService } from './parking-data.service';
import { SessionService } from './session.service';
import { InMemoryDataService } from './in-memory-data.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
  ],
  providers: [
    ParkingDataService,
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

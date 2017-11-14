/** modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing/app-routing.module';

/** components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CityComponent } from './city/city.component';

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

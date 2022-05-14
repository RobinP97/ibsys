import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DebugComponent } from './pages/debug/debug.component';
import { ForecastComponent } from './pages/forecast/forecast.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { ImportComponent } from './pages/import/import.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { NavBarPlanningComponent } from './pages/nav-bar-planning/nav-bar-planning.component';
import { NgModule } from '@angular/core';
import { NgxTranslateModule } from './translate/translate.module';
import { OrderPlanningComponent } from './pages/order-planning/order-planning.component';
import { PrettyPrintPipe } from './pipes/prettyprint.pipe';
import { ProductionComponent } from './pages/production/production.component';

@NgModule({
  declarations: [
    AppComponent,
    ImportComponent,
    PrettyPrintPipe,
    NavBarComponent,
    ForecastComponent,
    ProductionComponent,
    HomeComponent,
    NavBarPlanningComponent,
    DebugComponent,
    OrderPlanningComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    NgxTranslateModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DebugComponent } from './pages/debug/debug.component';
import { DirectsalesComponent } from './pages/directsales/directsales.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ForecastComponent } from './pages/forecast/forecast.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { ImportComponent } from './pages/import/import.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { NavBarPlanningComponent } from './shared/nav-bar-planning/nav-bar-planning.component';
import { NgModule } from '@angular/core';
import { NgxTranslateModule } from './translate/translate.module';
import { OrderPlanningComponent } from './pages/order-planning/order-planning.component';
import { PrettyPrintPipe } from './pipes/prettyprint.pipe';
import { ProductionComponent } from './pages/production/production.component';
import { SequencePlanningComponent } from './pages/sequence-planning/sequence-planning.component';

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
    SequencePlanningComponent,
    DirectsalesComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    DragDropModule,
    FormsModule,
    NgxTranslateModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { HttpLoaderFactory, SharedModule } from './shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { ExitWarningDialogComponent } from './shared/exit-warning-dialog/exit-warning-dialog.component';
// import { CapacityComponent } from './pages/capacity/capacity.component';
// import { DebugComponent } from './pages/debug/debug.component';
// import { DirectsalesComponent } from './pages/directsales/directsales.component';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { ExitWarningDialogComponent } from './shared/exit-warning-dialog/exit-warning-dialog.component';
// import { ExportComponent } from './pages/export/export.component';
import { FooterComponent } from './shared/footer/footer.component';
// import { ForecastComponent } from './pages/forecast/forecast.component';
// import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
// import { ImportComponent } from './pages/import/import.component';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatInputModule } from '@angular/material/input';
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
// import { NavBarPlanningComponent } from './shared/nav-bar-planning/nav-bar-planning.component';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
// import { NavBarPlanningComponent } from './shared/nav-bar-planning/nav-bar-planning.component';
import { NgModule } from '@angular/core';

// import { OrderPlanningComponent } from './pages/order-planning/order-planning.component';
// import { PrettyPrintPipe } from './pipes/prettyprint.pipe';
// import { ProductionComponent } from './pages/production/production.component';
// import { SequencePlanningComponent } from './pages/sequence-planning/sequence-planning.component';

@NgModule({
  declarations: [
    // AppComponent,
    // ImportComponent,
    // PrettyPrintPipe,
    // ExportComponent,
    // ForecastComponent,
    // ProductionComponent,
    // HomeComponent,
    // NavBarPlanningComponent,
    // DebugComponent,
    // OrderPlanningComponent,
    // SequencePlanningComponent,
    // DirectsalesComponent,
    // CapacityComponent,
    // ExportComponent,
    // FooterComponent,
    // ExitWarningDialogComponent,
    NavBarComponent,
    AppComponent,
    // PrettyPrintPipe,
    HomeComponent,
    // DebugComponent,
    FooterComponent,
  ],
  imports: [
    // AppRoutingModule,
    // BrowserAnimationsModule,
    // BrowserModule,
    // BsDropdownModule.forRoot(),
    // DragDropModule,
    // FormsModule,
    // NgxTranslateModule,
    // MatButtonModule,
    // MatCardModule,
    // MatDialogModule,
    // MatDividerModule,
    // MatIconModule,
    // MatInputModule,
    // MatListModule,
    // MatMenuModule,
    // MatToolbarModule,
    // MatTooltipModule,
    // MatSelectModule,
    // MatSidenavModule,
    // MatSnackBarModule,
    // MatStepperModule,
    // MatRadioModule,
    // MatTableModule,
    // MatToolbarModule,
    // MatButtonModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

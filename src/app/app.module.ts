import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ImportComponent } from './pages/import/import.component';
import { NgModule } from '@angular/core';
import { PrettyPrintPipe } from './pipes/prettyprint.pipe';

@NgModule({
  declarations: [AppComponent, ImportComponent, PrettyPrintPipe],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { RouterModule, Routes } from '@angular/router';

import { DebugComponent } from './pages/debug/debug.component';
import { ForecastComponent } from './pages/forecast/forecast.component';
import { HomeComponent } from './pages/home/home.component';
import { ImportComponent } from './pages/import/import.component';
import { NavBarPlanningComponent } from './shared/nav-bar-planning/nav-bar-planning.component';
import { NgModule } from '@angular/core';
import { OrderPlanningComponent } from './pages/order-planning/order-planning.component';
import { ProductionComponent } from './pages/production/production.component';
import { SequencePlanningComponent } from './pages/sequence-planning/sequence-planning.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'debug', component: DebugComponent },
  // NavBarPlanningComponent ist die Container-Komponente für die Planungskomponenten
  {
    path: 'planning',
    component: NavBarPlanningComponent,
    children: [
      { path: '', component: ImportComponent },
      { path: 'forecast', component: ForecastComponent },
      { path: 'production', component: ProductionComponent },
      { path: 'order-planning', component: OrderPlanningComponent },
      { path: 'sequencePlanning', component: SequencePlanningComponent },
      { path: 'orderPlanning', component: OrderPlanningComponent },
    ],
  },
];

// Die forRoot-Methode übernimmt dabei die Aufgabe,
// alle für das Routing benötigten Services bei der Applikation zu registrieren und die übergebenen Routen beim Routing-Framework anzumelden.
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// View besteht bei der Verwendung des Routers immer aus zwei Teilen:
// - statischer Teil, in dem beispielsweise die Links zu den Unterseiten dargestellt werden können,
// - dynamischen Teil – dem sogenannten RouterOutlet –, in dem die dynamischen Inhalte der Route gerendert werden.
//   => dynamischer Teil sind bei uns die einzelnen Schritte der Programmplanung

// <a routerLink='/home'>Home</a>
// RouterLink-Direktive: übernimmt die Aufgabe, einen gültigen Link (inklusive Basis-Pfad) zur Über uns-Seite zu generieren.

// Location-Strategie: Wie werden die URL in der Adresszeile dargestekke
// - PathLocation-Strategie (Default) aka. HTML-5 Modus (z.B. die schön formatiert URLs http://meine-webanwendung.de/settings)
// - - Angular nutzt hier die History-API um mit JS die URL zu verändern
// - - Voraussetzungen: ANgular muss den Basispfad der Anwendung kennen
// - - Der WEbserver auf dem die Anwendung läuft muss alle Request an die Anwendung weiterleiten
// - - Basispfad einrichten für z.B. http://mein-server.de/project-manager:
// - - - 1. head-Bereich index.html: <base href="/project-manager/">
// - - - - teilt dem Browser mit auf welcher Basis relative Pfade gebaut werden
// - - - 2. Injektion Token in app.module.ts {provide: APP_BASE_HREF, useValue: '/project-manager/'
// - - - - teilt dem Router mit auf welcher Basis relative Pfade gebaut werden
// - - Rewrite-Regeln im Webserver anpassen sodass http://mein-server.de/project-manager/settings die index.html ausliefert
//
// - HashLocation-Strategie
// - - Wenn man keinen Einfluss auf die Webserver-Konfiguration nehmen kann
// - - /#/ Zwischenpfad http://mein-server.de/project-manager/#/settings, stellt sicher, das mit jedem Request die index.html ausgliefert wird
// - - Konfiguration im RouterModule RouterModule.forRoot(appRoutes, {  useHash: true});

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Production } from 'src/app/model/production/production';
import { Split } from 'src/app/model/production/split';

@Component({
  selector: 'app-sequence-planning',
  templateUrl: './sequence-planning.component.html',
  styleUrls: ['./sequence-planning.component.scss'],
})
export class SequencePlanningComponent implements OnDestroy {
  // Zur Anzeige mit eventuellen Split. Splits als neue Produktion Objekte
  productionOrders: Production[];

  constructor(private readonly dataService: DataService) {
    this.productionOrders = this.dataService.getProductionOrders();
    this.initializeProductionOrderPositions();
    this.resolveSplitsToProductionOrders();
  }

  initializeProductionOrderPositions() {
    console.log(this.productionOrders);
    this.productionOrders.forEach((p, idx) => {
      if (p.sequencePos === undefined) {
        p.sequencePos = idx;
      }
    });
  }

  resolveSplitsToProductionOrders() {
    const newProductionOrders: Production[] = [];
    this.productionOrders.forEach((p) => {
      p.splits?.forEach((s) => {
        // Verbindliche Auftrage - Splitmenge
        p.binding_orders = p.binding_orders - s.amount;
        // Split als neuer Auftrag für die Anzeige
        const newProductionOrder = Object.assign({}, p);
        newProductionOrder.binding_orders = s.amount;
        newProductionOrder.sequencePos = s.sequencePos;
        newProductionOrder.splits = undefined;
        newProductionOrders.push(newProductionOrder);
      });
    });
    this.productionOrders.push(...newProductionOrders);
    this.productionOrders.sort((a, b) => a.sequencePos - b.sequencePos);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex !== event.previousIndex) {
      moveItemInArray(
        this.productionOrders,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  findProductOrderAtPos(pos: number): Production | undefined {
    return this.productionOrders.find((p) => p.sequencePos === pos);
  }

  getDefaultSplitAmnt(productionOrder: Production): number {
    return Math.floor(productionOrder.binding_orders / 20) * 10;
  }

  splitItem(productionOrder: Production, index: number, amtStr: string): void {
    const amt: number = parseInt(amtStr);
    // Anzeige anpassen => Dummy productionorder erstellen
    const newOrder: Production = Object.assign({}, productionOrder);
    productionOrder.binding_orders = newOrder.binding_orders - amt;
    newOrder.binding_orders = amt;
    this.productionOrders.splice(index + 1, 0, newOrder);
  }

  canDelete(id: number) {
    return this.productionOrders.filter((p) => p.id === id).length > 1;
  }

  deleteItem(productionOrder: Production, index: number): void {
    // TODO: Positionen updaten
    const relevantSplits: Production[] = this.productionOrders.filter(
      (p) =>
        p.id === productionOrder.id &&
        p.sequencePos !== productionOrder.sequencePos
    );
    // zu löschende Menge auf das erste Elemete aufaddieren
    relevantSplits[0].binding_orders += productionOrder.binding_orders;
    // Element entfernen
    this.productionOrders.splice(index, 1);
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    if (this.productionOrders) {
      // index auf sequencePos mappen: Position über die Komponente hinaus speichern
      this.productionOrders.forEach((p, idx) => (p.sequencePos = idx));

      const productOrdersToSave = [];

      const productIds: Set<number> = new Set(
        this.productionOrders.map((p) => p.id)
      );

      productIds.forEach((id) => {
        const productionOrdersSorted = this.productionOrders
          .filter((p) => p.id === id)
          .sort((a, b) => a.sequencePos - b.sequencePos);

        // Menge aller Aufträge einer produkt-id aufsummieren
        const totalBindingOrders: number = productionOrdersSorted
          ?.map((value) => value.binding_orders)
          .reduce((acc, cur) => acc + cur, 0);
        // letzter Fertigungsauftrag holen. An ihm werden die Spilkt sowie der Gesamtumfang des Auftrags abgespeichert
        const aggregated = Object.assign({}, productionOrdersSorted.pop());
        aggregated.binding_orders = totalBindingOrders;

        const splits: Split[] | undefined = productionOrdersSorted?.map(
          (p) =>
            <Split>{
              parentId: p.id,
              sequencePos: p.sequencePos,
              amount: p.binding_orders,
            }
        );
        aggregated.splits = splits;

        productOrdersToSave.push(aggregated);
      });
      if (productOrdersToSave.length !== 0) {
        this.dataService.setProductionOrders(productOrdersToSave);
      }
    }
  }
}

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { DataService } from 'src/app/service/data.service';
import { Production } from 'src/app/model/production/production';
import { Split } from 'src/app/model/production/split';
import { sequence } from '@angular/animations';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-sequence-planning',
  templateUrl: './sequence-planning.component.html',
  styleUrls: ['./sequence-planning.component.scss'],
})
export class SequencePlanningComponent implements OnDestroy {
  // Zur Anzeige mit eventuellen Split als neue Production Objekte
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

      // Positionen anpassen
      const first = this.findProductOrderAtPos(event.previousIndex);
      const second = this.findProductOrderAtPos(event.currentIndex);

      first.sequencePos = event.currentIndex;
      second.sequencePos = event.previousIndex;
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
    newOrder.sequencePos = index + 1;
    this.updateSequencePositions(index, true);
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
    // Positionen aktualisieren
    this.updateSequencePositions(index, false);
    // zu löschende Menge auf das erste Elemete aufaddieren
    relevantSplits[0].binding_orders += productionOrder.binding_orders;
    // Element entfernen
    this.productionOrders.splice(index, 1);
  }

  // Alle sequencePos ab startExclusive
  updateSequencePositions(startExclusive: number, inc: boolean) {
    this.productionOrders.forEach((p) => {
      if (p.sequencePos > startExclusive)
        inc ? p.sequencePos++ : p.sequencePos--;
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    if (this.productionOrders) {
      const id2Order = {};
      // Gruppierung anhand p.id
      this.productionOrders?.forEach((p) => {
        const arr: Production[] = [p];
        if (p.id in id2Order) {
          id2Order[p.id] = [...id2Order[p.id], p];
        } else {
          id2Order[p.id] = [p];
        }
      });

      const productOrdersToSave = [];
      Object.keys(id2Order).forEach((id) => {
        const productionOrders: Production[] = id2Order[id];
        const totalBindingOrders: number = productionOrders
          ?.map((value) => value.binding_orders)
          .reduce((acc, cur) => acc + cur, 0);
        const aggregatedProductionOrders: Production = Object.assign(
          {},
          productionOrders.pop()
        );
        aggregatedProductionOrders.binding_orders = totalBindingOrders;
        // Verbleibende Produkte als Splits eintragen
        const splits: Split[] | undefined = productionOrders?.map(
          (p) =>
            <Split>{
              parentId: p.id,
              sequencePos: p.sequencePos,
              amount: p.binding_orders,
            }
        );
        aggregatedProductionOrders.splits = splits;

        productOrdersToSave.push(aggregatedProductionOrders);
      });
      console.log('TO_SAVE', productOrdersToSave);

      if (productOrdersToSave.length !== 0) {
        this.dataService.setProductionOrders(productOrdersToSave);
      }
    }
  }
}

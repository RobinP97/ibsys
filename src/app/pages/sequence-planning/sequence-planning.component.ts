import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { MAX_ORDERS } from 'src/app/shared/constants';
import { Production } from 'src/app/model/production/production';
import { Split } from 'src/app/model/production/split';

@Component({
  selector: 'app-sequence-planning',
  templateUrl: './sequence-planning.component.html',
  styleUrls: ['./sequence-planning.component.scss'],
})
export class SequencePlanningComponent implements OnDestroy {
  ITEM_PER_LIST = 15;

  // Zur Anzeige mit eventuellen Split. Splits als neue Produktion Objekte
  productionOrders: Production[];

  // Wv Listen a 15 Items sollen angezeigt werden
  colCount: number[];

  constructor(private readonly dataService: DataService) {
    // this.productionOrders = this.dataService.getProductionOrders();
    this.productionOrders =
      this.dataService.getProductionOrdersWithResolvedSplits();
    // this.initializeProductionOrderSequence();
    this.setColumnCount();
    this.saveData();
  }

  // initializeProductionOrderSequence() {
  //   const newProductionOrders: Production[] = [];
  //   this.productionOrders.forEach((p) => {
  //     p.splits?.forEach((s) => {
  //       // Verbindliche Auftrage - Splitmenge
  //       p.binding_orders = p.binding_orders - s.amount;
  //       // Split als neuer Auftrag für die Anzeige
  //       const newProductionOrder = Object.assign({}, p);
  //       newProductionOrder.binding_orders = s.amount;
  //       newProductionOrder.sequencePos = s.sequencePos;
  //       newProductionOrder.splits = undefined;
  //       newProductionOrders.push(newProductionOrder);
  //     });
  //   });
  //   this.productionOrders.push(...newProductionOrders);
  //   this.productionOrders.sort((a, b) => a.sequencePos - b.sequencePos);
  // }

  //------------------------------------
  // Getter/ Setter
  //------------------------------------

  getNumOfColumns() {
    return this.colCount;
  }

  setColumnCount() {
    this.colCount = Array.from(
      Array(Math.ceil(this.productionOrders.length / this.ITEM_PER_LIST)).keys()
    );
  }

  getProductionOrdersToDisplay(col) {
    return [...this.productionOrders].slice(
      col * this.ITEM_PER_LIST,
      (col + 1) * this.ITEM_PER_LIST
    );
  }

  findProductOrderAtPos(pos: number): Production | undefined {
    return this.productionOrders.find((p) => p.sequencePos === pos);
  }

  getDefaultSplitAmount(productionOrder: Production): number {
    return Math.floor(productionOrder.binding_orders / 20) * 10;
  }

  //------------------------------------
  // Validators
  //------------------------------------

  canSplit(productionOrder: Production, amount: number) {
    return (
      +amount >= 10 &&
      amount &&
      +amount % 10 === 0 &&
      productionOrder.binding_orders >= 20 &&
      productionOrder.binding_orders - 10 >= +amount &&
      this.productionOrders.length < MAX_ORDERS
    );
  }

  canInput(productionOrder: Production) {
    return productionOrder.binding_orders < 20;
  }

  canDelete(id: number) {
    return this.productionOrders.filter((p) => p.id === id).length > 1;
  }

  //------------------------------------
  // Aktionen
  //------------------------------------

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.productionOrders,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        this.productionOrders,
        this.productionOrders,
        event.previousIndex + this.ITEM_PER_LIST * +event.previousContainer.id,
        event.currentIndex + this.ITEM_PER_LIST * +event.container.id
      );
    }
    this.update();
  }

  splitItem(
    productionOrder: Production,
    index: number,
    col: number,
    amtStr: string
  ): void {
    const amt: number = parseInt(amtStr);
    // Anzeige anpassen => Dummy productionorder erstellen
    const newOrder: Production = Object.assign({}, productionOrder);
    productionOrder.binding_orders = newOrder.binding_orders - amt;
    newOrder.binding_orders = amt;
    this.productionOrders.splice(
      index + 1 + this.ITEM_PER_LIST * col,
      0,
      newOrder
    );
    this.update();
  }

  deleteItem(productionOrder: Production, index: number, col: number): void {
    const relevantSplits: Production[] = this.productionOrders.filter(
      (p, idx) =>
        p.id === productionOrder.id && idx !== index + col * this.ITEM_PER_LIST
    );
    // zu löschende Menge auf das letzte Elemete aufaddieren
    relevantSplits.pop().binding_orders += productionOrder.binding_orders;
    // Element entfernen
    this.productionOrders.splice(index + col * this.ITEM_PER_LIST, 1);
    this.update();
  }

  reset() {
    this.productionOrders = this.dataService.getProductionOrders();
    this.update();
  }

  update() {
    this.setColumnCount();
    this.saveData();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
  }

  saveData() {
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

        // Menge aller Aufträge zu einer produkt-id aufsummieren
        const totalBindingOrders: number = productionOrdersSorted
          .map((value) => value.binding_orders)
          .reduce((acc, cur) => acc + cur, 0);
        // letzter Fertigungsauftrag: An ihm werden die Spilts sowie der Gesamtumfang des Auftrags abgespeichert
        const aggregatedOrder = Object.assign({}, productionOrdersSorted.pop());
        aggregatedOrder.binding_orders = totalBindingOrders;

        const splits: Split[] | undefined = productionOrdersSorted.map(
          (p) =>
            <Split>{
              parentId: p.id,
              sequencePos: p.sequencePos,
              amount: p.binding_orders,
            }
        );
        aggregatedOrder.splits = splits;

        productOrdersToSave.push(aggregatedOrder);
      });
      if (productOrdersToSave.length !== 0) {
        this.dataService.setProductionOrders(productOrdersToSave);
      }
    }
  }
}

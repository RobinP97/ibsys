import { Component, OnInit } from '@angular/core';

import { IoService } from 'src/app/service/io.service';
import { Results } from 'src/app/model/import/results';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  importedData: Results;
  inputData;
  fileUploadSuccessful: boolean;
  xmlParsingSuccessful: boolean;
  readFileSuccesful: boolean;
  file: File;

  constructor(private readonly ioService: IoService) {}

  ngOnInit(): void {
    console.log('');
  }

  // TODO: Prüfung, nur XML-Dateien
  // TODO: Upload, nur wenn eine Datei ausgewählt wurde
  onFileChange(event: any): void {
    console.log('file', event.target);
    this.file = event.target.files[0];
  }

  upload(): void {
    console.log('UPLOAD:', this.file);
    // FileReader objects can read from a file or a blob
    const reader: FileReader = new FileReader();
    // FileReader Events:
    // load – no errors, reading complete.
    // error – error has occurred.
    reader.addEventListener('load', (e) => {
      this.readFileSuccesful = true;
      console.log(reader.result);

      const parsedXml = this.ioService.parseXml(reader.result);
      this.xmlParsingSuccessful = parsedXml !== undefined;
      this.inputData = parsedXml;
      console.log(this.inputData);

      this.loadData();
    });

    // TODO: Fehlerbehandlung
    reader.addEventListener('error', (err) => {
      console.error('ERROR reading file:', reader.error);
      this.readFileSuccesful = false;
    });
    let tewt = null;
    reader.readAsText(this.file, 'utf-8');
  }

  // inputData verarbeiten und in der Anwendung bereitstellen
  // am besten über Subject, die abonniert werden können (Änderungen werden dann an alle Subscriber weitergeleitet - sehr wichtig!)
  // in dem Sinne benötigt man das Restults Interface gar nicht
  loadData(): void {
    // TODO: Fehler wenn this.inputData === undefined
    this.importedData = {
      game: this.inputData.results.attr.game,
      period: this.inputData.results.attr.period,
      group: this.inputData.results.attr.group,
      forecasts: undefined,
      warehousestock: undefined,
      inwardstockmovement: undefined,
      futureinwardstockmovement: undefined,
      idletimecosts: undefined,
      waitinglistworkstations: undefined,
      waitingliststock: undefined,
      ordersinwork: undefined,
      completedorders: undefined,
      cycletimes: undefined,
      result: undefined,
    };
    console.log(this.importedData);
  }
}

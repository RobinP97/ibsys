import { Component, OnInit } from '@angular/core';
import { IoService, xmlDebugOptions } from 'src/app/service/io.service';

import { Clipboard } from '@angular/cdk/clipboard';
import { ParserOptions } from 'xml2js';
import { Results } from 'src/app/model/import/results';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
})
export class DebugComponent implements OnInit {
  // Importierte Daten als JSON
  importedData: Results;
  // Importierte Daten als XML-String
  readFileString: string;
  // importedData als XML-String
  jsonToXmlString: string;

  // Einstellungen für den XML-Parser ohne attr und Value prozessoren, sodass 0.00 nicht als 0 dargestellt wird
  xmlDebugOptions: ParserOptions;
  readEqualsParsed: boolean;
  prettyprintImportedData: boolean = false;

  importedDataKeys: string[] = [
    'game',
    'group',
    'period',
    'forecast',
    'warehousestock',
    'inwardstockmovement',
    'futureinwardstockmovement',
    'idletimecosts',
    'waitinglistworkstations',
    'waitingliststock',
    'ordersinwork',
    'completedorders',
    'cycletimes',
    'result',
  ];

  constructor(private clipboard: Clipboard) {}

  ngOnInit(): void {
    this.xmlDebugOptions = xmlDebugOptions;
  }

  //-----------------------------------------------------------------------
  // validierung: json to xml
  //-----------------------------------------------------------------------
  testXmlTextEquality(originalParsedXmlString, json) {
    this.jsonToXmlString = this.jsonToXml(json);
    this.readFileString = originalParsedXmlString;
    console.log('json', json);
    console.log('jsonToXmlString', this.jsonToXmlString);
    console.log('readFileString', this.readFileString);

    this.readEqualsParsed =
      this.readFileString.length === this.jsonToXmlString.length &&
      this.findFirstDifference(this.readFileString, this.jsonToXmlString) ===
        undefined;
  }

  findFirstDifference(a: string, b: string) {
    const arr1 = [...a];
    const arr2 = [...b];
    return arr2.find((char, i) => arr1[i] !== char);
  }

  jsonToXml(jsonToParse: any): string {
    const tagHelper = new Map([
      ['ordersinwork', 'workplace'],
      ['inwardstockmovement', 'order'],
      ['futureinwardstockmovement', 'order'],
      ['waitinglistworkstations', 'workplace'],
      ['waitingliststock', 'missingpart'],
      ['ordersinwork', 'workplace'],
      ['completedorders', 'order'],
    ]);
    const emptyTags = [
      'mandatoryOrders',
      'warehousestock',
      'inwardstockmovement',
      'futureinwardstockmovement',
      'idletimecosts',
      'waitinglistworkstations',
      'waitingliststock',
      'ordersinwork',
      'completedorders',
      'cycletimes',
      'result',
    ];
    let tag = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
    tag += this.parseProperty(jsonToParse, 'results', tagHelper, emptyTags);
    return tag;
  }

  parseProperty(
    object: any,
    tagname: string,
    tagHelper: Map<string, string>,
    emptyTags: string[]
  ) {
    if (object === undefined || Object.keys(object).length === 0)
      return `<${tagname}/>`; // opt: Zeilenumbruch
    let tag = `<${tagname}`;
    let subObjectKeys: string[] = [];
    // Attribute
    for (let key in object) {
      let value = object[key];
      // Spezialfall - Kurzschreibweise </...>
      if (value === undefined) {
        if (emptyTags.includes(key)) subObjectKeys.push(key);
        continue;
      }
      // Spezialfall
      if (key === 'totalstockvalue') {
        subObjectKeys.push('totalstockvalue');
        continue;
      }
      let isAttribute = typeof value !== 'object';
      if (isAttribute) {
        tag += ` ${key}="${
          !Number.isNaN(value) ? value.toString().replace('.', ',') : value
        }"`;
      } else {
        subObjectKeys.push(key);
      }
    }

    // geschachtelte Tags
    if (subObjectKeys.length > 0) {
      tag += '>'; //
      for (let key of subObjectKeys) {
        let value = object[key];
        // Spezialfall
        if (key === 'totalstockvalue') {
          tag += `<totalstockvalue>${value
            .toString()
            .replace('.', ',')}</totalstockvalue>`; // opt: Zeilenumbruch
          continue;
        }
        if (tagHelper.has(key)) {
          if (value !== undefined) {
            tag += `<${key}>`;
            for (let entry of value) {
              tag += this.parseProperty(
                entry,
                tagHelper.get(key),
                tagHelper,
                emptyTags
              );
            }
            tag += `</${key}>`;
          } else {
            tag += `<${key}/>`;
          }
        } else {
          value = Array.isArray(value) ? value : [value];
          for (let entry of value) {
            tag += this.parseProperty(entry, key, tagHelper, emptyTags);
          }
        }
      }
      tag += `</${tagname}>`; // opt: Zeilenumbruch
    } else {
      tag += '/>'; // opt: Zeilenumbruch
    }
    return tag;
  }

  copyText(textToCopy: string) {
    return this.clipboard.copy(textToCopy);
  }

  copyLongText(textToCopy: string) {
    const pending = this.clipboard.beginCopy(textToCopy);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        pending.destroy();
      }
    };
    attempt();
  }
}

import { Parser, ParserOptions } from 'xml2js';

import { Injectable } from '@angular/core';
import { parseNumbers } from 'xml2js/lib/processors';

// DEBUG: Ohne attr und value Prozessoren
export const xmlDebugOptions: ParserOptions = {
  attrkey: 'attr', // (default: $): Prefix that is used to access the attributes.
  charkey: '_text', // (default: _): Prefix that is used to access the character content.
  trim: true, // (default: false): Trim the whitespace at the beginning and end of text nodes.
  normalizeTags: true, // normalizeTags (default: false): Normalize all tag names to lowercase
  normalize: true, // normalize (default: false): Trim whitespaces inside text nodes.
};

@Injectable({
  providedIn: 'root',
})
export class IoService {
  constructor() {}
  // Doku unter: https://openbase.com/js/xml2js/documentation
  readonly xmlOptions: ParserOptions = {
    attrkey: 'attr', // (default: $): Prefix that is used to access the attributes.
    charkey: '_text', // (default: _): Prefix that is used to access the character content.
    trim: true, // (default: false): Trim the whitespace at the beginning and end of text nodes.
    normalizeTags: true, // normalizeTags (default: false): Normalize all tag names to lowercase
    normalize: true, // normalize (default: false): Trim whitespaces inside text nodes.
    // explicitChildren : true,
    //
    // Hooks für die Verarbietung der Attribtename/werte bzw Nodenamen/werte
    // attrNameProcessors : [ (name) => { console.log('NAME:', name); return name; }],
    attrValueProcessors: [this.parseNumber], //[ (name, value) => { console.log('NAME:', name, 'VALUE:', value); return name; }],
    // tagNameProcessors : [ (name) => { console.log('TAGNAME:', name); return name; }],
    valueProcessors: [this.parseNumber], // (value, name) =>  { console.log("VALUE:", value, "NAME", name); return name; }]
  };

  parseXml(xml: any, xmlOptions?: ParserOptions): any | Error {
    const xmlParser = xmlOptions
      ? new Parser(xmlOptions)
      : new Parser(this.xmlOptions);
    let parsedXml;
    xmlParser.parseString(xml, (err, res) => {
      if (res) {
        console.log('Parsed xml file', res);
        parsedXml = res;
      } else {
        // Fehler während des parsing-Vorgangs => XML-Datei ist nicht wohlgeformt!
        throw err;
      }
    });
    console.log(parsedXml);

    return parsedXml;
  }

  parseNumber(value: any, name: any): any {
    let toParse = value;
    const numRegex: RegExp = new RegExp('^([0-9]+)(.[0-9]{1,2})?$');
    // NICHT isNaN(value), da "4-4-4-4"='true' ergibt und damit geparst werden (z.B, 4-4-4-4 ergibt 4)
    if (numRegex.test(value)) {
      // parseFloat() erwartet Zahlenformat #####.## - Komma ersetzen
      toParse = value.replace(',', '.');
      toParse = toParse.includes('.')
        ? parseFloat(toParse)
        : parseInt(toParse, 10);
    }
    return toParse;
  }
}

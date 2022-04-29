import { Parser, ParserOptions } from 'xml2js';

import { Injectable } from '@angular/core';

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
    // attrValueProcessors : [ (name, value) => { console.log('NAME:', name, 'VALUE:', value); return name; }],
    // tagNameProcessors : [ (name) => { console.log('TAGNAME:', name); return name; }],
    // valueProcessors : [ (value, name) =>  { console.log("VALUE:", value, "NAME", name); return name; }]
  };

  parseXml(xml: any): any {
    const xmlParser = new Parser(this.xmlOptions);
    let parsedXml;
    xmlParser.parseString(xml, (err, res) => {
      if (res) {
        console.log('Parsed xml file', res);
        parsedXml = res;
      } else {
        // TODO: Formfehler in der ui anzeigen
        console.error('ERROR parsing xml file', xml, err);
      }
    });
    console.log(parsedXml);

    return parsedXml;
  }
}

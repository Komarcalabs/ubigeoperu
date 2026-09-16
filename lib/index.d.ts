declare namespace Ubigeoperu {
  export interface UbigeoItemData {
    id: string;
    name: string;
    level: string;
    childrens?: UbigeoItemData[];
  }

  export class UbigeoItem {
    id: string;
    name: string;
    level: string;

    constructor(data: UbigeoItemData);
    
    districts(): UbigeoItem[] | void;
    provinces(): UbigeoItem[] | void;
    toJSON(): Omit<UbigeoItemData, 'childrens'>;
  }
}

declare class Ubigeoperu {
  constructor();
  
  getRegions(): Ubigeoperu.UbigeoItem[];
  getRegions(codeOrName: string | number): Ubigeoperu.UbigeoItem | undefined;
  
  getProvinces(): Ubigeoperu.UbigeoItem[];
  getProvinces(codeOrName: string | number): Ubigeoperu.UbigeoItem | undefined;
  
  getDistricts(): Ubigeoperu.UbigeoItem[];
  getDistricts(codeOrName: string | number): Ubigeoperu.UbigeoItem | undefined;
  
  getByUbigeoCode(code: string | number): Ubigeoperu.UbigeoItem | undefined;
}

export = Ubigeoperu;

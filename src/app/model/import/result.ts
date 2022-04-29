export interface result {
  general: {
    capacity: {
      current: number;
      average: number;
      all: number;
    };
    possiblecapacity: {
      current: number;
      average: number;
      all: number;
    };
    relpossiblenormalcapacity: {
      current: string;
      average: string;
      all: string;
    };
    productivetime: {
      current: number;
      average: number;
      all: number;
    };
    effiency: {
      current: string;
      average: string;
      all: string;
    };
    sellwish: {
      current: number;
      average: number;
      all: number;
    };
    salesquantity: {
      current: number;
      average: number;
      all: number;
    };
    deliveryreliability: {
      current: string;
      average: string;
      all: string;
    };
    idletime: {
      current: number;
      average: number;
      all: number;
    };
    idletimecosts: {
      current: number;
      average: number;
      all: number;
    };
    storevalue: {
      current: number;
      average: number;
      all: number;
    };
    storagecosts: {
      current: number;
      average: number;
      all: number;
    };
  };

  defectivegoods: {
    quantity: {
      current: number;
      average: number;
      all: number;
    };
    costs: {
      current: number;
      average: number;
      all: number;
    };
  };

  normalsale: {
    salesprice: {
      current: number;
      average: number;
      all: number;
    };
    profit: {
      current: number;
      average: number;
      all: number;
    };
    profitperunit: {
      current: number;
      average: number;
      all: number;
    };
  };

  directsale: {
    profit: {
      current: number;
      average: number;
      all: number;
    };
    contractpenalty: {
      current: number;
      average: number;
      all: number;
    };
  };

  marketplacesale: {
    profit: {
      current: number;
      average: number;
      all: number;
    };
  };

  summary: {
    profit: {
      current: number;
      average: number;
      all: number;
    };
  };
}

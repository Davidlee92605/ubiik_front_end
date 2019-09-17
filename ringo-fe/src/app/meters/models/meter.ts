export interface Meter {
  meterId: string;
  fanId: string;

  // keys
  guk: string;
  ak: string;

  // meta
  address: string;
  coords: string;
  notes: string;

  // status
  meterState: string;
  fanState: string;
  registered: boolean;
  authenticated: string;
  lastSeen: Date;

  checked?: boolean;
}

export interface MeterSearchResult {
  size: number;
  meters: Meter[];
}

export function isMeterSearchResult(result: any): result is MeterSearchResult {
  return (result as MeterSearchResult).meters !== undefined;
}




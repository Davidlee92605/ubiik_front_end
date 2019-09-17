export interface MeterIdsSearchResult {
  meterIds: string[];
  total: number;
  maxMeterIdsReturned: number; // hard coded in backend for now
}

export function isMeterIdsSearchResult(result: any): result is MeterIdsSearchResult {
  return (result as MeterIdsSearchResult).maxMeterIdsReturned !== undefined;
}


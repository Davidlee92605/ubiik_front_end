import {DateTime} from 'luxon';

export interface LoadProfile {
  meterId: string;
  fanId: string;
  recordId: number;
  readingNum: number;
  tstamp: string;
  status: number;
  reading: number;
  receivedAt: string;
}

export interface LoadProfileRow {
  ts: DateTime;
  meterId: string;
  reading: number;
}
//
// export interface LoadProfile {
//   meterId: string;
//   readings: {[readingId: string]: LoadProfileData[]};
// }

export interface LoadProfileRequest {
  // meters to display load profile data for (we only need the ids)
  selectedMeterIds: string[];

  // query params
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc' | '';
}

export interface LoadProfileResponse {
  data: LoadProfile[];
  total: number;
}

export interface DateRange {
  minDate: string;
  maxDate: string;
}

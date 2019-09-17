import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {debug, url} from '@ringo/shared';
import {MeterIdsSearchResult} from '@ringo/load-profile/models/query';
import {DateRange, LoadProfileResponse} from '@ringo/load-profile/models';
import {Observable} from 'rxjs';
import {BackendQueryParams} from '@ringo/shared/models/query';

@Injectable({
  providedIn: 'root'
})
export class LoadProfileService {

  constructor(
    private http: HttpClient,
  ) {
  }

  searchMeterIds(search: string) {
    return this.http.post<MeterIdsSearchResult>(url(`/meter-ids`), {search})
      .pipe(
        debug('searchMeterIds')
      );
  }

  requestLoadProfile(query: BackendQueryParams) {
    return this.http.get<LoadProfileResponse>(url(`/load-profile`), {
      params: {
        ...query,
        // convert the 2 number fields to string
        pageIndex: query.pageIndex.toString(),
        pageSize: query.pageSize.toString()
      }
    }).pipe(
      debug('requestLoadProfile')
    );
  }

  export(startDate: string, endDate: string) {
    return this.http.get<{ url: string }>(url(`/load-profile-export`), {
      params: {
        export: '1',
        startDate: startDate,
        endDate: endDate,
      }
    })
      .pipe(
        debug('export'),
      );
  }

  exportRange(): Observable<DateRange> {
    return this.http.get<{ minDate: string, maxDate: string }>(url(`/export-range`))
      .pipe(
        debug('exportRange')
      );

  }
}


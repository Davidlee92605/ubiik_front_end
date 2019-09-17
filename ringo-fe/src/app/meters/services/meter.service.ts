import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {debug, url} from '@ringo/shared';
import {BackendError} from '@ringo/core/models';
import {Observable, of} from 'rxjs';
import {Meter, MeterSearchResult} from '@ringo/meters/models/meter';
import {ATCommandRequest, MeterQueryRequest} from '@ringo/meters/models/on-demand';
import {BackendQueryParams} from '@ringo/shared/models/query';

@Injectable({
  providedIn: 'root'
})
export class MeterService {

  constructor(
    private http: HttpClient,
  ) {
  }

  uploadMetersFile(file: File | null): Observable<BackendError | null> {
    if (!file) {
      return of(({
        message: 'File was null',
        code: 'EBADFILE'
      }));
    }
    if (file.size === 0) {
      return of(({
        message: 'File empty',
        code: 'EEMPTYFILE'
      }));
    }
    const formData: FormData = new FormData();
    formData.append('meters', file, file.name);
    return this.http.put<BackendError | null>(url(`/meters`), formData);
  }

  deleteMeter(meter: Meter) {
    return this.http.delete<BackendError | null>(url(`/meters/${meter.meterId}`));
  }

  search(query: BackendQueryParams): Observable<BackendError | MeterSearchResult> {
    return this.http.get<BackendError | MeterSearchResult>(url('/meters'), {
      params: {
        ...query,
        // convert the 2 number fields to string
        pageIndex: query.pageIndex.toString(),
        pageSize: query.pageSize.toString()
      }
    });
  }

  sendATCommand(request: ATCommandRequest) {
    return this.http.post<BackendError>(url(`/send-command`), request)
      .pipe(
        debug('backend.sendCommand.post')
      );
  }

  queryLoadProfile(requests: MeterQueryRequest[]) {
    return this.http.post<BackendError>(url(`/load-profile-on-demand`), requests)
      .pipe(
        debug('backend.queryLoadProfile.post')
      );
  }

  updateMeter(value: Meter): Observable<BackendError> {
    return this.http.post<BackendError>(url(`/meters`), value);
  }
}

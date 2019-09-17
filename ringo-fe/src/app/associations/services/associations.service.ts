import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BackendQueryParams} from '@ringo/shared/models/query';
import {BackendError} from '@ringo/core/models';
import {debug, url} from '@ringo/shared';
import {Manager} from '@ringo/associations/models/associations';

@Injectable({
  providedIn: 'root'
})
export class AssociationsService {

  constructor(
    private http: HttpClient,
  ) { }

  search(query: BackendQueryParams) {
    return this.http.get<Manager[] | BackendError>(url(`/user-meters`), {
      params: {
        ...query,
        // convert the 2 number fields to string
        pageIndex: query.pageIndex.toString(),
        pageSize: query.pageSize.toString()
      }
    })
      .pipe(
        debug('managers.search.get')
      );
  }

  associate(uid: number, meterId: string) {
    return this.http.post<BackendError>(url(`/user-meters/${uid}/${meterId}`), {});
  }

  dissociate(uid: number, meterId: string) {
    return this.http.delete<BackendError>(url(`/user-meters/${uid}/${meterId}`), {});
  }

  getAssociated(uid: number) {
    return this.http.get<BackendError>(url(`/user-meters/${uid}`), {});
  }
}

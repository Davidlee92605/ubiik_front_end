import {HttpClient} from '@angular/common/http';
import {UserInfo} from '@ringo/auth/models';
import {debug, url} from '@ringo/shared';
import {BackendError} from '@ringo/core/models';
import {BackendQueryParams} from '@ringo/shared/models/query';
import {AccountSearchResult} from '@ringo/accounts/models/account';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private http: HttpClient
  ) {
  }

  updateAccount(account: UserInfo) {
    return this.http.post<BackendError | null>(url(`/accounts`), account)
      .pipe(
        debug('account.update.post')
      );
  }

  search(query: BackendQueryParams) {
    return this.http.get<AccountSearchResult | BackendError>(url(`/accounts`), {
      params: {
        ...query,
        // convert the 2 number fields to string
        pageIndex: query.pageIndex.toString(),
        pageSize: query.pageSize.toString()
      }
    })
      .pipe(
        debug('account.search.get')
      );
  }

  deleteAccount(id: number) {
    return this.http.delete<BackendError | null>(url(`/accounts/${id}`))
      .pipe(
        debug('account.delete.delete')
      );
  }

  updateUserMeter(email: string, meterId: string) {
    return this.http.post<BackendError | null>(url(`/user-meters/${email}/${meterId}`), {});
  }


  deleteUserMeter(email: string, meterId: string) {
    return this.http.delete<BackendError | null>(url(`/user-meters/${email}/${meterId}`), {});
  }

}

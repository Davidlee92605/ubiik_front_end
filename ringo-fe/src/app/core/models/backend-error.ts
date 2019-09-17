import {HttpErrorResponse} from '@angular/common/http';

export interface BackendError {
  message: string;
  code: string;
}

export function isBackendError(e: any): e is BackendError {
  return (e as BackendError).code !== undefined;
}

export const fromHttpError = (err: HttpErrorResponse): BackendError => ({
  message: err.message,
  code: err.status.toString()
});


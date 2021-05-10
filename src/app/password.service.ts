import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {PasswordPolicyResult} from './model/password-policy-result';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private passwordCheckUrl = '/password/check';

  constructor(private http: HttpClient) {
  }

  validate(password: string): Observable<PasswordPolicyResult> {
    const params = new FormData();
    params.append('password', password);
    return this.http.post<PasswordPolicyResult>(this.passwordCheckUrl, params).pipe(
      catchError(err => of({
        isValid: false,
        violations: [].concat(err.message)
      }))
    );
  }

}

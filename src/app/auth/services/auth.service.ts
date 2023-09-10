import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from "../../../environments/environments";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of, tap, throwError} from "rxjs";
import {AuthStatus, CheckTokenResponse, LoginResponseInterface, User} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = {email, password};

    return this.http.post<LoginResponseInterface>(url, body).pipe(
      map( ({user, token}) => this.setAuthentication(user, token) ),
      catchError( err => throwError(() => err.error.message) )
    );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    const body = {name, email, password};
    return this.http.post<LoginResponseInterface>(url, body).pipe(
      map( ({user, token}) => this.setAuthentication(user, token) ),
    );
  }

  checkAuthStatus(): Observable<boolean> {
      const url = `${this.baseUrl}/auth/check-token`;
      const token = localStorage.getItem('token');
      if (!token) {
        this.logout();
        return of(false);
      }
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`);

      return this.http.get<CheckTokenResponse>(url, {headers}).pipe(
        map( ({user, token}) => this.setAuthentication(user, token) ),
        catchError( err => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        } )
      );
  }

logout(): void {
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('token');
}

}

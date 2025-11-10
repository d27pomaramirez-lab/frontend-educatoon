import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

    private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

    constructor() { }

    isLoggedIn$ = this.loggedIn.asObservable();

    signOut(): void {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      this.loggedIn.next(false);
    }

    public saveToken(token: string): void {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(TOKEN_KEY, token);
      this.loggedIn.next(true);
    }

    public getToken(): string | null {
      return window.localStorage.getItem(TOKEN_KEY);
    }

    public isLoggedIn(): boolean {
      const token = window.localStorage.getItem(TOKEN_KEY);
      return !!token; 
    }

    public saveUser(user: any): void {
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public getUser(): any {
      const user = window.localStorage.getItem(USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
      return null;
    }

  
}
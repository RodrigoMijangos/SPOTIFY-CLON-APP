import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesStorageService {
  
  constructor(
    private _cookieService: CookieService
  ) { }

  setCookie(key: string, value: string, expires?: Date | number): void {
    this._cookieService.set(key, value, expires);
  }

  getCookie(key: string): string {
    return this._cookieService.get(key);
  }

}
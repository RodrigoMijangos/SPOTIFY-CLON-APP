import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService {

  constructor(
    private _cookieService: CookieService
  ){}

  getCookie(key: string): string{
    return this._cookieService.get(key);
  }

  setCookie(key: string, value: string, expires: number | Date | undefined = undefined): void{
    this._cookieService.set(key,value, expires);
  }

  deleteCookie(key:string): void{
    this._cookieService.delete(key);
  }

  isCookieValid(key: string): boolean {
    return this._cookieService.check(key);
  }
}

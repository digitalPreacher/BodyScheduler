import { Injectable } from '@angular/core';
import { C } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }


  //get user cookie 
  public getCookie(name: string): string {
    const cookieArray: string[] = document.cookie.split(";");
    const cookieName = `${name}=`;
    let cookie: string;
    let token: string;

    for (let i: number = 0; i < cookieArray.length; i++) {
      cookie = cookieArray[i].replace(/^\s+/g, '');
      if (cookie.indexOf(cookieName) == 0) {
        token = cookie.substring(cookieName.length, cookie.length);
        return token;
      };
    }

    return '';
  }

  //set user cookie 
  setCookie(params: any) { 
    document.cookie = (params.name ? params.name : '') + '=' + (params.value ? params.value : '') + ';'
  }

  //delete user cookie
  deleteCookie(cookieName: string) {
    this.setCookie({ name: cookieName, value: '' });
  }

}

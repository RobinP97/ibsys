import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}
  // TODO: SessionStorage oder LocalStorage
  public setItem(key: string, data: any): void {
    // sessionStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getItem(key: string): any {
    // return JSON.parse(sessionStorage.getItem(key));
    return JSON.parse(localStorage.getItem(key));
  }

  public removeItem(key: string): void {
    // sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }

  public clear() {
    // sessionStorage.clear()
    localStorage.clear();
  }
}

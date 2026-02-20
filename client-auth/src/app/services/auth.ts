import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // BACKEND URL

  constructor(private http: HttpClient) { }

  // REGISTER
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // LOGIN
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // SIMPAN TOKEN
  async setToken(token: string) {
    await Preferences.set({ key: 'auth_token', value: token });
  }

  // CEK LOGIN
  async isLoggedIn(): Promise<boolean> {
    const { value } = await Preferences.get({ key: 'auth_token' });
    return !!value;
  }

  // LOGOUT
  async logout() {
    await Preferences.remove({ key: 'auth_token' });
  }
}

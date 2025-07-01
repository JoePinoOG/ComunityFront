import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private platform: Platform
  ) {}

  get(url: string, options?: any): Observable<any> {
    if (this.platform.is('capacitor')) {
      return from(this.nativeHttpGet(url, options));
    }
    return this.http.get(url, options);
  }

  post(url: string, data: any, options?: any): Observable<any> {
    if (this.platform.is('capacitor')) {
      return from(this.nativeHttpPost(url, data, options));
    }
    return this.http.post(url, data, options);
  }

  put(url: string, data: any, options?: any): Observable<any> {
    if (this.platform.is('capacitor')) {
      return from(this.nativeHttpPut(url, data, options));
    }
    return this.http.put(url, data, options);
  }

  private async nativeHttpGet(url: string, options?: any) {
    const nativeOptions = this.buildNativeOptions(options);
    const response = await CapacitorHttp.get({
      url,
      ...nativeOptions
    });
    return response.data;
  }

  private async nativeHttpPost(url: string, data: any, options?: any) {
    const nativeOptions = this.buildNativeOptions(options);
    const response = await CapacitorHttp.post({
      url,
      data,
      ...nativeOptions
    });
    return response.data;
  }

  private async nativeHttpPut(url: string, data: any, options?: any) {
    const nativeOptions = this.buildNativeOptions(options);
    const response = await CapacitorHttp.put({
      url,
      data,
      ...nativeOptions
    });
    return response.data;
  }

  private buildNativeOptions(options?: any) {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Agregar token de autorización si existe
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Agregar headers adicionales si se proporcionan
    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    return {
      headers,
      ...options
    };
  }
}

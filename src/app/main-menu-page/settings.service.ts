import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private http: HttpClient) {}
  // private baseUrl = 'https://api.apismarthome-wisowski-konrad.com/api';
  private baseUrl = 'http://192.168.1.103:3000/api';

  fetchChartData() {
    return this.http.get<any>(`${this.baseUrl}/chart-data`);
  }

  updateAiModel(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ml/update`);
  }

  updateSetting(userId: string, settingName: string, enabled: boolean): Observable<any> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/settings`, { userId, name: settingName, enabled });
  }

  fetchSettings(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/settings/${userId}`);
  }
}

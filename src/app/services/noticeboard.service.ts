import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoticeboardService {
  private apiUrl = 'http://localhost:3000/api/messages'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  sendMessage(messageData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, messageData);
  }
}
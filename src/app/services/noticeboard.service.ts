import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticeboardService {
  private baseUrl = `${environment.apiUrl}/api/noticeboard`;  // Base URL for noticeboard API

  constructor(private http: HttpClient) {
    console.log('NoticeboardService initialized with Base URL:', this.baseUrl); // Debugging log
  }

  // Fetches messages
  getMessages(): Observable<any[]> {
    const getUrl = `${this.baseUrl}/messages`;  // Adjusted endpoint for GET
    console.log('Fetching messages from:', getUrl); // Debugging log
    return this.http.get<any[]>(getUrl);
  }

  // Sends a message
  sendMessage(messageData: any): Observable<any> {
    const postUrl = `${this.baseUrl}/send`;  // Adjusted endpoint for POST
    console.log('Sending message data to API at:', postUrl, 'with data:', messageData); // Debugging log
    return this.http.post<any>(postUrl, messageData);
  }
}

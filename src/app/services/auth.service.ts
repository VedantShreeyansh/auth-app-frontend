import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signup(firstName: any, lastName: any, email: any, password: any, role: any) {
    throw new Error('Method not implemented.');
  }
  validateSessionToken(sessionToken: string) {
    throw new Error('Method not implemented.');
  }
  logoutUser() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'http://localhost:5114'; // Replace with your CouchDB URL

  constructor(private http: HttpClient) { }

  // Mock method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Mock method to log in the user
  login(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Mock method to log out the user
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Method to register a new user
  register(user: any): Observable<any> {
    var credentials = {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "password": user.password,
        "email": user.email,
        "role": user.adminOrUser,
        "isApproved": false
    }
    console.log(credentials);
    return this.http.post(`${this.apiUrl}/api/Auth/register`, credentials);
  }


  // Method to retrieve user information by email
  // getUserByEmail(email: string): Observable<any> {
  //   // const url = `${this.apiUrl}/users/_find`;
  //   // const query = {
  //   //   selector: {
  //   //     email: email
  //   //   }
  //   // };
  //   // return this.http.post(url, query);
  // }
  getUserByEmail(email: string){
    console.log(email);
  }
}
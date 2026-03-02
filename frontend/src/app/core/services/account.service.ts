import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id?: number;
  ownerName: string;
  email: string;
  status?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/accounts';

  createAccount(account: Partial<Account>): Observable<number> {
    return this.http.post<number>(this.apiUrl, account);
  }

  getAccount(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  testResilience(cep: string): Observable<string> {
    // Retorna texto (String) em vez de JSON por conta do ResponseEntity<String> no backend
    return this.http.get(`${this.apiUrl}/resilience-demo/${cep}`, { responseType: 'text' });
  }
}

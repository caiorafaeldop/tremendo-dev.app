import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService, Account } from '../../core/services/account.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-grid">
      
      <!-- Card: Criar Conta -->
      <div class="card form-card">
        <h2>Criar Nova Conta <span class="badge">CQRS: Command</span></h2>
        <form [formGroup]="accountForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label>Nome do Proprietário</label>
            <input type="text" formControlName="ownerName" placeholder="João Tremendo">
            <div class="error" *ngIf="accountForm.get('ownerName')?.invalid && accountForm.get('ownerName')?.touched">
              Nome é obrigatório
            </div>
          </div>
          
          <div class="form-group">
            <label>E-mail Corporativo</label>
            <input type="email" formControlName="email" placeholder="joao@empresa.com">
            <div class="error" *ngIf="accountForm.get('email')?.invalid && accountForm.get('email')?.touched">
              E-mail inválido
            </div>
          </div>
          
          <button type="submit" [disabled]="accountForm.invalid || isLoading">
            {{ isLoading ? 'Processando...' : 'Registrar Conta' }}
          </button>
        </form>
      </div>

      <!-- Card: Resultado da Conta -->
      <div class="card result-card" *ngIf="lastCreatedAccount">
        <h2>Conta Criada! <span class="badge success">DDD Status: {{ lastCreatedAccount.status }}</span></h2>
        <div class="info-row"><strong>ID:</strong> {{ lastCreatedAccount.id }}</div>
        <div class="info-row"><strong>Nome:</strong> {{ lastCreatedAccount.ownerName }}</div>
        <div class="info-row"><strong>Email:</strong> {{ lastCreatedAccount.email }}</div>
        <div class="info-row"><strong>Criada em:</strong> {{ lastCreatedAccount.createdAt | date:'medium' }}</div>
      </div>

      <!-- Card: Teste Circuit Breaker -->
      <div class="card features-card">
        <h2>Teste de Resiliência <span class="badge warn">Microserviços</span></h2>
        <p>Aperte o botão abaixo para consultar o backend, que por sua vez consultará o microsserviço ViaCEP via Feign. Se o ViaCEP cair (ou simularmos um fallback), o Resilience4j entra em ação.</p>
        
        <div class="input-action">
          <input #cepInput type="text" placeholder="Digite um CEP" value="01001000">
          <button class="btn-secondary" (click)="testCircuitBreaker(cepInput.value)" [disabled]="isTestingResilience">
            Testar Rota Feign
          </button>
        </div>
        
        <div class="resilience-result" *ngIf="resilienceResult">
          {{ resilienceResult }}
        </div>
      </div>

    </div>
  `,
  styleUrls: ['./account-dashboard.component.css']
})
export class AccountDashboardComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  accountForm: FormGroup;
  isLoading = false;
  isTestingResilience = false;
  
  lastCreatedAccount: Account | null = null;
  resilienceResult = '';

  constructor() {
    this.accountForm = this.fb.group({
      ownerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.isLoading = true;
      this.accountService.createAccount(this.accountForm.value).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (id) => {
          // Após o COMMAND (Criar), executamos a QUERY (Buscar) - Princípio CQRS
          this.fetchAccountDetails(id);
          this.accountForm.reset();
        },
        error: (err) => {
          alert('Erro na criação da conta. E-mail já existe ou API offline.');
          console.error(err);
        }
      });
    }
  }

  fetchAccountDetails(id: number) {
    this.accountService.getAccount(id).subscribe({
      next: (account) => this.lastCreatedAccount = account,
      error: (err) => console.error('Erro ao buscar query de conta', err)
    });
  }

  testCircuitBreaker(cep: string) {
    this.isTestingResilience = true;
    this.resilienceResult = 'Chamando API...';
    
    this.accountService.testResilience(cep).pipe(
      finalize(() => this.isTestingResilience = false)
    ).subscribe({
      next: (res) => this.resilienceResult = res,
      error: (err) => this.resilienceResult = 'Falha crítica não tratada pelo fallback.'
    });
  }
}

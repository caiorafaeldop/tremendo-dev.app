import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface Account {
  id: number;
  ownerName: string;
  email: string;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-cqrs-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="section">
      <span class="section-label">Comparação: Padrões de Backend</span>
      <h2 class="section-title">Service único (Node) vs CQRS (Java/Spring)</h2>
      <p class="section-subtitle" style="margin-bottom: 2.5rem;">
        No Node, costumamos jogar tudo num service.ts. No CQRS, <strong>escrita (Command) e leitura (Query)</strong>
        são handlers separados. Os dados vão direto pro <strong>PostgreSQL real</strong> na Neon.
      </p>

      <div class="cqrs-grid">
        <!-- Formulário -->
        <div class="card">
          <h3>📝 Criar Conta <span class="tech-badge">COMMAND</span></h3>
          
          <form [formGroup]="form" (ngSubmit)="onSubmit()" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label>Nome</label>
              <input class="input" formControlName="ownerName" placeholder="Seu nome">
              <div class="field-error" *ngIf="form.get('ownerName')?.invalid && form.get('ownerName')?.touched">
                Campo obrigatório
              </div>
            </div>
            <div class="form-group">
              <label>E-mail</label>
              <input class="input" formControlName="email" placeholder="email&#64;exemplo.com">
              <div class="field-error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
                E-mail inválido
              </div>
            </div>
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid || loading">
              {{ loading ? 'Salvando no PostgreSQL...' : 'Registrar no Banco' }}
            </button>
          </form>

          <div class="result-card" *ngIf="createdAccount">
            <h4>🔍 Resultado da Query <span class="tech-badge green">QUERY</span></h4>
            <div class="result-row"><span>ID:</span><strong>{{ createdAccount.id }}</strong></div>
            <div class="result-row"><span>Nome:</span><strong>{{ createdAccount.ownerName }}</strong></div>
            <div class="result-row"><span>Email:</span><strong>{{ createdAccount.email }}</strong></div>
            <div class="result-row"><span>Status (DDD):</span><strong>{{ createdAccount.status }}</strong></div>
            <div class="result-row"><span>Criada em:</span><strong>{{ createdAccount.createdAt | date:'medium' }}</strong></div>
          </div>

          <div class="error-msg" *ngIf="errorMsg">⚠️ {{ errorMsg }}</div>
        </div>

        <!-- Fluxo explicado -->
        <div class="card flow-card">
          <h3>🔄 Fluxo do Código</h3>
          
          <div class="flow-steps">
            <div class="flow-step" [class.active]="currentStep >= 1">
              <div class="step-num">1</div>
              <div class="step-content">
                <strong>Angular → POST /api/v1/accounts</strong>
                <p>O FormBuilder coleta os dados do formulário reativo e o HttpClient envia via Observable.</p>
              </div>
            </div>
            
            <div class="flow-step" [class.active]="currentStep >= 2">
              <div class="step-num">2</div>
              <div class="step-content">
                <strong>Controller → CreateAccountCommand</strong>
                <p>O Controller cria um Command (CQRS) e despacha pro Handler. Sem lógica de negócio aqui.</p>
              </div>
            </div>

            <div class="flow-step" [class.active]="currentStep >= 3">
              <div class="step-num">3</div>
              <div class="step-content">
                <strong>Handler → Account.createNew()</strong>
                <p>O Handler chama a factory do domínio. A entidade valida as regras de negócio (DDD rico).</p>
              </div>
            </div>

            <div class="flow-step" [class.active]="currentStep >= 4">
              <div class="step-num">4</div>
              <div class="step-content">
                <strong>Repository Port → PostgreSQL (Neon)</strong>
                <p>A porta do repositório (Hexagonal) persiste via JPA no banco real.</p>
              </div>
            </div>

            <div class="flow-step" [class.active]="currentStep >= 5">
              <div class="step-num">5</div>
              <div class="step-content">
                <strong>GET /accounts/{{'{'}}id{{'}'}} → Query Handler</strong>
                <p>Após criar, fazemos uma QUERY separada para buscar. Leitura e escrita desacopladas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cqrs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .cqrs-grid h3 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.15rem;
      margin-bottom: 0.5rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .field-error {
      color: var(--red);
      font-size: 0.8rem;
      margin-top: 0.4rem;
    }
    .result-card {
      margin-top: 1.5rem;
      padding: 1.25rem;
      background: var(--bg-code);
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }
    .result-card h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    .result-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px dashed var(--border);
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .result-row strong { color: var(--text); }
    .error-msg {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      background: var(--red-glow);
      color: var(--red);
      font-size: 0.9rem;
    }
    .flow-card h3 { margin-bottom: 1.5rem; }
    .flow-steps {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .flow-step {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      opacity: 0.4;
      transition: all 0.4s ease;
    }
    .flow-step.active {
      opacity: 1;
      border-color: var(--accent-border);
      background: var(--accent-glow);
    }
    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--accent);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .step-content strong {
      font-size: 0.9rem;
      display: block;
      margin-bottom: 0.25rem;
    }
    .step-content p {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    @media (max-width: 768px) {
      .cqrs-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CqrsDemoComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  form: FormGroup;
  loading = false;
  createdAccount: Account | null = null;
  errorMsg = '';
  currentStep = 0;

  constructor() {
    this.form = this.fb.group({
      ownerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.createdAccount = null;
    this.currentStep = 1;

    setTimeout(() => this.currentStep = 2, 300);
    setTimeout(() => this.currentStep = 3, 600);

    this.http.post<number>('http://localhost:8080/api/v1/accounts', this.form.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (id) => {
          this.currentStep = 4;
          setTimeout(() => {
            this.currentStep = 5;
            // Query separada (CQRS)
            this.http.get<Account>(`http://localhost:8080/api/v1/accounts/${id}`)
              .subscribe({
                next: (account) => {
                  this.createdAccount = account;
                  this.form.reset();
                },
                error: () => this.errorMsg = 'Conta criada mas erro na query de leitura.'
              });
          }, 400);
        },
        error: (err) => {
          this.currentStep = 0;
          this.errorMsg = 'Erro ao criar conta. E-mail já existe ou backend offline.';
        }
      });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resilience-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section">
      <span class="section-label">Comparação: Resiliência</span>
      <h2 class="section-title">Axios retry (Node) vs CircuitBreaker (Java/Spring)</h2>
      <p class="section-subtitle" style="margin-bottom: 2.5rem;">
        No Node, se uma API externa cai, geralmente fazemos retry com Axios ou libs como <code>opossum</code>.
        No Java enterprise, o <strong>Resilience4j</strong> com <code>&#64;CircuitBreaker</code> é o padrão de mercado.
      </p>

      <div class="resilience-grid">
        <!-- Demo -->
        <div class="card">
          <h3>🧪 Teste ao vivo</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 1rem 0;">
            O backend chama a API ViaCEP via <code>OpenFeign</code>. Se ela responder, sucesso. 
            Se falhar, o <code>&#64;CircuitBreaker</code> ativa o fallback automaticamente.
          </p>

          <div class="test-area">
            <div class="input-row">
              <input class="input" [(ngModel)]="cep" placeholder="CEP (ex: 01001000)">
              <button class="btn btn-primary" (click)="testApi()" [disabled]="testing">
                {{ testing ? 'Consultando...' : 'Testar Feign + CircuitBreaker' }}
              </button>
            </div>

            <div class="response-box" *ngIf="response" [class.success]="isSuccess" [class.fallback]="!isSuccess">
              <div class="response-header">
                <span *ngIf="isSuccess">✅ Retornou do microsserviço</span>
                <span *ngIf="!isSuccess">🛡️ Fallback ativado (Resilience4j)</span>
              </div>
              <pre>{{ response }}</pre>
            </div>
          </div>
        </div>

        <!-- Explicação -->
        <div class="card">
          <h3>📖 Como funciona</h3>

          <div class="concept-list">
            <div class="concept">
              <div class="concept-state closed">CLOSED</div>
              <p>Estado normal. Todas as chamadas passam direto pro serviço externo.</p>
            </div>
            <div class="concept arrow">↓ falhas acumulam</div>
            <div class="concept">
              <div class="concept-state open">OPEN</div>
              <p>Muitas falhas! O circuit "abre" e nem tenta chamar o serviço. Vai direto pro fallback.</p>
            </div>
            <div class="concept arrow">↓ após waitDurationInOpenState</div>
            <div class="concept">
              <div class="concept-state half">HALF_OPEN</div>
              <p>Permite algumas chamadas de teste. Se voltarem OK, fecha o circuit de volta.</p>
            </div>
          </div>

          <div class="code-block" style="margin-top: 1.5rem;">
            <span class="comment">// Java: Controller com CircuitBreaker</span><br>
            <span class="type">&#64;CircuitBreaker</span>(<br>
            &nbsp;&nbsp;name = <span class="string">"externalApi"</span>,<br>
            &nbsp;&nbsp;fallbackMethod = <span class="string">"cepFallback"</span><br>
            )<br>
            <span class="keyword">public</span> ResponseEntity&lt;String&gt; <span class="function">testResilience</span>(<br>
            &nbsp;&nbsp;<span class="type">&#64;PathVariable</span> String cep) {{ '{' }}<br>
            &nbsp;&nbsp;<span class="keyword">return</span> cepClient.<span class="function">consultarCep</span>(cep);<br>
            {{ '}' }}
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .resilience-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .resilience-grid h3 {
      margin-bottom: 0.5rem;
      font-size: 1.15rem;
    }
    .input-row {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .input-row .input { flex: 1; }
    .input-row .btn { white-space: nowrap; }
    .response-box {
      padding: 1.25rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }
    .response-box.success { background: var(--green-glow); border-color: rgba(52, 211, 153, 0.3); }
    .response-box.fallback { background: var(--yellow-glow); border-color: rgba(251, 191, 36, 0.3); }
    .response-header {
      font-weight: 600;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }
    .response-box pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      white-space: pre-wrap;
      word-break: break-all;
      color: var(--text-muted);
      margin: 0;
    }
    .concept-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    .concept {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .concept p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .concept.arrow {
      color: var(--text-dim);
      font-size: 0.75rem;
      padding-left: 2.5rem;
      font-family: 'JetBrains Mono', monospace;
    }
    .concept-state {
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      min-width: 80px;
      text-align: center;
    }
    .concept-state.closed { background: var(--green-glow); color: var(--green); border: 1px solid rgba(52,211,153,0.3); }
    .concept-state.open { background: var(--red-glow); color: var(--red); border: 1px solid rgba(248,113,113,0.3); }
    .concept-state.half { background: var(--yellow-glow); color: var(--yellow); border: 1px solid rgba(251,191,36,0.3); }
    @media (max-width: 768px) {
      .resilience-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ResilienceDemoComponent {
  private http = inject(HttpClient);
  
  cep = '01001000';
  testing = false;
  response = '';
  isSuccess = false;

  testApi() {
    this.testing = true;
    this.response = '';

    this.http.get(`http://localhost:8080/api/v1/accounts/resilience-demo/${this.cep}`, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.response = res;
          this.isSuccess = true;
          this.testing = false;
        },
        error: (err) => {
          this.response = 'Serviço indisponível. O Circuit Breaker ativou o fallback!';
          this.isSuccess = false;
          this.testing = false;
        }
      });
  }
}

import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, delay, tap } from 'rxjs/operators';

interface LogEntry {
  term: string;
  status: 'cancelled' | 'success' | 'pending';
  timestamp: number;
}

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section">
      <span class="section-label">Comparação: Reatividade</span>
      <h2 class="section-title">useEffect (React) vs switchMap (RxJS/Angular)</h2>
      <p class="section-subtitle" style="margin-bottom: 2rem;">
        No React, preciso de <code>AbortController</code> manual no cleanup do <code>useEffect</code> pra evitar race conditions.
        No Angular, o <code>switchMap</code> do RxJS <strong>cancela automaticamente</strong> as requisições anteriores. Teste abaixo:
      </p>

      <div class="demo-container">
        <div class="search-box">
          <label>Digite um nome para buscar (ex: "maria"):</label>
          <input
            class="input search-input"
            type="text"
            placeholder="Comece a digitar..."
            [(ngModel)]="searchTerm"
            (input)="onSearch($event)"
          >
        </div>

        <div class="comparison-grid">
          <!-- Lado Angular -->
          <div class="card comparison-card">
            <div class="comparison-header">
              <span class="tech-badge">🅰️ Angular + RxJS</span>
              <span class="tech-badge green">✅ Inteligente</span>
            </div>

            <div class="code-block" style="margin-bottom: 1rem;" [innerHTML]="angularCode"></div>

            <div class="log-container">
              <div class="log-title">📋 Requisições (Angular):</div>
              <div *ngFor="let log of angularLogs"
                   class="log-entry"
                   [ngClass]="log.status">
                <span *ngIf="log.status === 'cancelled'">❌</span>
                <span *ngIf="log.status === 'success'">✅</span>
                <span *ngIf="log.status === 'pending'">⏳</span>
                GET /search?q="{{ log.term }}"
                <span class="log-status">{{ log.status === 'cancelled' ? 'CANCELADA' : log.status === 'success' ? 'ENVIADA' : 'PENDENTE...' }}</span>
              </div>
              <div *ngIf="angularLogs.length === 0" class="log-empty">Aguardando digitação...</div>
            </div>

            <div class="stats">
              <span>Requisições enviadas ao servidor: <strong class="stat-green">{{ angularSent }}</strong></span>
            </div>
          </div>

          <!-- Lado React -->
          <div class="card comparison-card">
            <div class="comparison-header">
              <span class="tech-badge red">⚛️ React (sem AbortController)</span>
              <span class="tech-badge yellow">⚠️ Ingênuo</span>
            </div>

            <div class="code-block" style="margin-bottom: 1rem;" [innerHTML]="reactCode"></div>

            <div class="log-container">
              <div class="log-title">📋 Requisições (React sem cleanup):</div>
              <div *ngFor="let log of reactLogs"
                   class="log-entry success">
                ✅ GET /search?q="{{ log.term }}"
                <span class="log-status">ENVIADA</span>
              </div>
              <div *ngIf="reactLogs.length === 0" class="log-empty">Aguardando digitação...</div>
            </div>

            <div class="stats">
              <span>Requisições enviadas ao servidor: <strong class="stat-red">{{ reactLogs.length }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Conclusão -->
        <div class="card conclusion-card" *ngIf="angularLogs.length > 0">
          <h3>💡 O que aconteceu?</h3>
          <p>
            Você digitou <strong>{{ totalKeystrokes }}</strong> caracteres.
            O Angular enviou apenas <strong class="stat-green">{{ angularSent }}</strong> requisição(ões) ao servidor,
            enquanto o React (sem cleanup) teria enviado <strong class="stat-red">{{ reactLogs.length }}</strong>.
          </p>
          <p style="color: var(--text-dim); font-size: 0.9rem; margin-top: 0.5rem;">
            <em>Obs: No React, isso é resolvível com AbortController no cleanup do useEffect,
            mas no Angular com RxJS já vem de fábrica.</em>
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .demo-container { margin-top: 1rem; }
    .search-box { margin-bottom: 2rem; }
    .search-box label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.75rem;
      color: var(--text-muted);
    }
    .search-input {
      max-width: 500px;
      font-size: 1.1rem;
      padding: 1rem 1.25rem;
    }
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .comparison-header {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .log-container {
      min-height: 120px;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .log-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }
    .log-empty {
      font-size: 0.8rem;
      color: var(--text-dim);
      font-style: italic;
    }
    .log-status {
      margin-left: auto;
      font-weight: 700;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stats {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .stat-green { color: var(--green); }
    .stat-red { color: var(--red); }
    .conclusion-card {
      background: var(--accent-glow);
      border-color: var(--accent-border);
    }
    .conclusion-card h3 {
      margin-bottom: 0.75rem;
      color: var(--accent-light);
    }
    .conclusion-card p { line-height: 1.7; }
    @media (max-width: 768px) {
      .comparison-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class RxjsDemoComponent implements OnDestroy {
  searchTerm = '';
  searchSubject$ = new Subject<string>();
  angularLogs: LogEntry[] = [];
  reactLogs: LogEntry[] = [];
  angularSent = 0;
  totalKeystrokes = 0;

  angularCode = '<span class="comment">// Angular: switchMap cancela req anteriores</span><br>' +
    'this.search$.pipe(<br>' +
    '&nbsp;&nbsp;debounceTime(300),<br>' +
    '&nbsp;&nbsp;distinctUntilChanged(),<br>' +
    '&nbsp;&nbsp;switchMap(term =&gt; this.http.get("/api?q=" + term))<br>' +
    ').subscribe(result =&gt; { ... });';

  reactCode = '<span class="comment">// React: useEffect sem cleanup</span><br>' +
    'useEffect(() =&gt; {<br>' +
    '&nbsp;&nbsp;fetch("/api?q=" + term)<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;.then(r =&gt; r.json())<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;.then(setResults);<br>' +
    '}, [term]); <span class="comment">// Dispara em TODA mudança</span>';

  private sub: Subscription;

  constructor() {
    this.sub = this.searchSubject$.pipe(
      tap(term => {
        this.angularLogs = this.angularLogs.map(log =>
          log.status === 'pending' ? { ...log, status: 'cancelled' as const } : log
        );
        if (term.length > 0) {
          this.angularLogs.push({ term, status: 'pending', timestamp: Date.now() });
        }
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term) return of(null);
        return of(term).pipe(delay(200));
      })
    ).subscribe(result => {
      if (result) {
        const lastPending = [...this.angularLogs].reverse().find(l => l.status === 'pending');
        if (lastPending) {
          lastPending.status = 'success';
          this.angularSent++;
        }
      }
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.totalKeystrokes++;

    if (value.length > 0) {
      this.reactLogs.push({ term: value, status: 'success', timestamp: Date.now() });
    }

    this.searchSubject$.next(value);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

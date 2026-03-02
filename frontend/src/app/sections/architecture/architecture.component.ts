import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section">
      <span class="section-label">Comparação: Organização de Código</span>
      <h2 class="section-title">MVC flat (Node) vs Arquitetura Hexagonal (Java)</h2>
     

      <div class="onion-container">
        <div class="onion-ring infra" (mouseenter)="activeLayer = 'infra'" (mouseleave)="activeLayer = ''">
          <span class="ring-label">🔌 Infrastructure (Adapters)</span>
          <div class="onion-ring application" (mouseenter)="activeLayer = 'app'; $event.stopPropagation()" (mouseleave)="activeLayer = 'infra'">
            <span class="ring-label">⚙️ Application (Use Cases)</span>
            <div class="onion-ring domain" (mouseenter)="activeLayer = 'domain'; $event.stopPropagation()" (mouseleave)="activeLayer = 'app'">
              <span class="ring-label">💎 Domain</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detalhes da camada -->
      <div class="layer-details" *ngIf="activeLayer">
        <div class="card" *ngIf="activeLayer === 'domain'">
          <h3>💎 Domain — O coração do negócio</h3>
          <p>Não depende de NADA externo. Sem Spring, sem JPA, sem HTTP. Puro Java.</p>
          <div class="file-list">
            <div class="file-item" *ngFor="let f of domainFiles">
              <span class="file-icon">📄</span>
              <span class="file-name">{{ f.name }}</span>
              <span class="file-desc">{{ f.desc }}</span>
            </div>
          </div>
        </div>
        
        <div class="card" *ngIf="activeLayer === 'app'">
          <h3>⚙️ Application — Orquestradores</h3>
          <p>Coordena os casos de uso. Não sabe COMO persistir, só que precisa persistir (via Port).</p>
          <div class="file-list">
            <div class="file-item" *ngFor="let f of applicationFiles">
              <span class="file-icon">📄</span>
              <span class="file-name">{{ f.name }}</span>
              <span class="file-desc">{{ f.desc }}</span>
            </div>
          </div>
        </div>

        <div class="card" *ngIf="activeLayer === 'infra'">
          <h3>🔌 Infrastructure — Adaptadores do mundo real</h3>
          <p>Aqui entram os frameworks: Spring MVC (IN/Web), Spring Data JPA (OUT/Persistence), Feign Client (OUT/REST).</p>
          <div class="file-list">
            <div class="file-item" *ngFor="let f of infraFiles">
              <span class="file-icon">📄</span>
              <span class="file-name">{{ f.name }}</span>
              <span class="file-desc">{{ f.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="comparison-note card" style="margin-top: 2rem;">
        <h3>💡 O que aprendi vindo do Node.js</h3>
        <p>
          No Node.js, minha estrutura era <code>controllers/</code>, <code>services/</code> e <code>models/</code>.
          Funcionava, mas o service virava um "faz tudo" de 500 linhas. Na Hexagonal, se eu trocar
          PostgreSQL por MongoDB amanhã, só mudo o adaptador de persistência — o domínio e a aplicação
          não mudam uma linha. Esse nível de desacoplamento não é natural no ecossistema Node.
        </p>
      </div>
    </section>
  `,
  styles: [`
    .onion-container {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }
    .onion-ring {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }
    .onion-ring.infra {
      width: 400px;
      height: 400px;
      background: rgba(248, 113, 113, 0.08);
      border: 2px solid rgba(248, 113, 113, 0.2);
    }
    .onion-ring.infra:hover { border-color: rgba(248, 113, 113, 0.5); }
    .onion-ring.application {
      width: 270px;
      height: 270px;
      background: rgba(251, 191, 36, 0.08);
      border: 2px solid rgba(251, 191, 36, 0.2);
    }
    .onion-ring.application:hover { border-color: rgba(251, 191, 36, 0.5); }
    .onion-ring.domain {
      width: 140px;
      height: 140px;
      background: rgba(129, 140, 248, 0.12);
      border: 2px solid rgba(129, 140, 248, 0.3);
    }
    .onion-ring.domain:hover { border-color: rgba(129, 140, 248, 0.6); box-shadow: 0 0 30px rgba(129, 140, 248, 0.2); }
    .ring-label {
      position: absolute;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .infra > .ring-label { top: 12px; }
    .application > .ring-label { top: 8px; }
    .domain > .ring-label { font-size: 0.8rem; }

    .layer-details { margin-top: 1rem; }
    .layer-details h3 { margin-bottom: 0.75rem; }
    .layer-details > .card > p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .file-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .file-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-radius: 6px;
      background: var(--bg-code);
      border: 1px solid var(--border);
      font-size: 0.85rem;
    }
    .file-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--accent-light);
      min-width: 250px;
    }
    .file-desc {
      color: var(--text-dim);
      font-size: 0.8rem;
    }
    .comparison-note h3 { margin-bottom: 0.75rem; color: var(--accent-light); }
    .comparison-note p { color: var(--text-muted); line-height: 1.7; }
  `]
})
export class ArchitectureComponent {
  activeLayer = '';

  domainFiles = [
    { name: 'domain/model/Account.java', desc: 'Entidade rica com validate(), activate(), block()' },
    { name: 'domain/model/AccountStatus.java', desc: 'Enum: ACTIVE, BLOCKED, PENDING' },
    { name: 'domain/exceptions/DomainException.java', desc: 'Exceção de regra de negócio' },
  ];

  applicationFiles = [
    { name: 'application/commands/CreateAccountCommand.java', desc: 'DTO de escrita (CQRS)' },
    { name: 'application/commands/handlers/CreateAccountCommandHandler.java', desc: 'Orquestra a criação' },
    { name: 'application/queries/GetAccountQuery.java', desc: 'DTO de leitura (CQRS)' },
    { name: 'application/queries/handlers/GetAccountQueryHandler.java', desc: 'Busca no repositório' },
    { name: 'application/ports/out/AccountRepositoryPort.java', desc: 'Interface (Porta de saída)' },
  ];

  infraFiles = [
    { name: 'adapters/in/web/AccountController.java', desc: 'REST API (Entrada)' },
    { name: 'adapters/in/web/GlobalExceptionHandler.java', desc: 'Tratamento global de erros' },
    { name: 'adapters/out/persistence/AccountEntity.java', desc: 'Entidade JPA (Saída)' },
    { name: 'adapters/out/persistence/AccountPersistenceAdapter.java', desc: 'Implementa a Porta' },
    { name: 'adapters/out/rest/IntegracaoServicoExternoClient.java', desc: 'Feign Client (Saída)' },
    { name: 'config/SecurityConfig.java', desc: 'OAuth2 Resource Server' },
    { name: 'logging/LoggingAspect.java', desc: 'AOP para logs' },
  ];
}

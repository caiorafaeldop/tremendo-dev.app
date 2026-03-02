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

      <div class="arch-layout">
        <!-- ESQUERDA: Diagrama Onion -->
        <div class="onion-side">
          <div class="onion-container">
            <div class="onion-ring infra" (mouseenter)="activeLayer = 'infra'" (mouseleave)="activeLayer = ''">
              <span class="ring-label">🔌 Infrastructure</span>
              <div class="onion-ring application" (mouseenter)="activeLayer = 'app'; $event.stopPropagation()" (mouseleave)="activeLayer = 'infra'">
                <span class="ring-label">⚙️ Application</span>
                <div class="onion-ring domain" (mouseenter)="activeLayer = 'domain'; $event.stopPropagation()" (mouseleave)="activeLayer = 'app'">
                  <span class="ring-label">💎 Domain</span>
                </div>
              </div>
            </div>
          </div>
          <p class="onion-hint">Passe o mouse nas camadas →</p>
        </div>

        <!-- DIREITA: Detalhes da camada -->
        <div class="details-side">
          <!-- Placeholder quando nada selecionado -->
          <div class="card placeholder-card" *ngIf="!activeLayer">
            <div class="placeholder-icon">👆</div>
            <h3>Passe o mouse no diagrama</h3>
            <p>Cada camada revela seus arquivos e responsabilidades.</p>
            <div class="legend">
              <div class="legend-item"><span class="dot domain-dot"></span> Domain — Regras de negócio puras</div>
              <div class="legend-item"><span class="dot app-dot"></span> Application — Orquestração (Use Cases)</div>
              <div class="legend-item"><span class="dot infra-dot"></span> Infrastructure — Frameworks e adapters</div>
            </div>
          </div>

          <!-- Domain -->
          <div class="card active-card domain-border" *ngIf="activeLayer === 'domain'">
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

          <!-- Application -->
          <div class="card active-card app-border" *ngIf="activeLayer === 'app'">
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

          <!-- Infrastructure -->
          <div class="card active-card infra-border" *ngIf="activeLayer === 'infra'">
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
      </div>

      <div class="comparison-note card" style="margin-top: 2rem;">
        <h3>⚖️Node Vs. Java</h3>
        <div class="diff-table">
          <div class="diff-row header">
            <span>Aspecto</span>
            <span>🟢 Node / Express</span>
            <span>☕ Java / Hexagonal</span>
          </div>
          <div class="diff-row" *ngFor="let d of divergencias">
            <span class="diff-aspect">{{ d.aspect }}</span>
            <span class="diff-node">{{ d.node }}</span>
            <span class="diff-java">{{ d.java }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Layout lado a lado */
    .arch-layout {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2.5rem;
      align-items: start;
      margin-bottom: 1rem;
    }

    /* Lado esquerdo: bola */
    .onion-side {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .onion-hint {
      font-size: 0.75rem;
      color: var(--text-dim);
      font-style: italic;
      animation: float 2.5s ease-in-out infinite;
    }
    .onion-container {
      display: flex;
      justify-content: center;
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
      width: 340px;
      height: 340px;
      background: rgba(248, 113, 113, 0.08);
      border: 2px solid rgba(248, 113, 113, 0.2);
    }
    .onion-ring.infra:hover { border-color: rgba(248, 113, 113, 0.5); background: rgba(248, 113, 113, 0.12); }
    .onion-ring.application {
      width: 230px;
      height: 230px;
      background: rgba(251, 191, 36, 0.08);
      border: 2px solid rgba(251, 191, 36, 0.2);
    }
    .onion-ring.application:hover { border-color: rgba(251, 191, 36, 0.5); background: rgba(251, 191, 36, 0.12); }
    .onion-ring.domain {
      width: 120px;
      height: 120px;
      background: rgba(129, 140, 248, 0.12);
      border: 2px solid rgba(129, 140, 248, 0.3);
    }
    .onion-ring.domain:hover { border-color: rgba(129, 140, 248, 0.6); box-shadow: 0 0 30px rgba(129, 140, 248, 0.2); }
    .ring-label {
      position: absolute;
      font-size: 0.7rem;
      font-weight: 600;
      white-space: nowrap;
      color: var(--text-muted);
    }
    .infra > .ring-label { top: 10px; }
    .application > .ring-label { top: 8px; }
    .domain > .ring-label { font-size: 0.75rem; }

    /* Lado direito: detalhes */
    .details-side {
      min-height: 340px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .placeholder-card {
      text-align: center;
      padding: 2.5rem 2rem;
    }
    .placeholder-icon { font-size: 2rem; margin-bottom: 1rem; }
    .placeholder-card h3 { color: var(--text-dim); margin-bottom: 0.5rem; font-size: 1rem; }
    .placeholder-card > p { color: var(--text-dim); font-size: 0.85rem; margin-bottom: 1.5rem; }
    .legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
      margin: 0 auto;
      width: fit-content;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .domain-dot { background: rgba(129, 140, 248, 0.8); }
    .app-dot { background: rgba(251, 191, 36, 0.8); }
    .infra-dot { background: rgba(248, 113, 113, 0.8); }

    .active-card {
      animation: fadeSlideIn 0.3s ease-out;
    }
    .domain-border { border-color: rgba(129, 140, 248, 0.4); }
    .app-border { border-color: rgba(251, 191, 36, 0.4); }
    .infra-border { border-color: rgba(248, 113, 113, 0.4); }

    .active-card h3 { margin-bottom: 0.75rem; }
    .active-card > p {
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
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      background: var(--bg-code);
      border: 1px solid var(--border);
      font-size: 0.85rem;
    }
    .file-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--accent-light);
      min-width: 200px;
    }
    .file-desc {
      color: var(--text-dim);
      font-size: 0.75rem;
    }

    .comparison-note h3 { margin-bottom: 1rem; color: var(--accent-light); }
    .diff-table {
      display: flex;
      flex-direction: column;
      gap: 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .diff-row {
      display: grid;
      grid-template-columns: 1.2fr 2fr 2fr;
      gap: 0;
    }
    .diff-row > span {
      padding: 0.6rem 1rem;
      font-size: 0.82rem;
      border-bottom: 1px solid var(--border);
      line-height: 1.5;
    }
    .diff-row > span:not(:last-child) { border-right: 1px solid var(--border); }
    .diff-row.header > span {
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: var(--bg-code);
      color: var(--text-muted);
    }
    .diff-row:last-child > span { border-bottom: none; }
    .diff-aspect { font-weight: 600; color: var(--text); background: rgba(255,255,255,0.02); }
    .diff-node { color: var(--text-muted); }
    .diff-java { color: var(--text-muted); }

    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @media (max-width: 900px) {
      .arch-layout {
        grid-template-columns: 1fr;
      }
      .onion-hint { display: none; }
    }
  `]
})
export class ArchitectureComponent {
  activeLayer = '';

  divergencias = [
    {
      aspect: 'Estrutura de pacotes',
      node: 'controllers/ services/ models/ — organização por tipo de arquivo',
      java: 'domain/ application/ infrastructure/ — organização por responsabilidade de negócio'
    },
    {
      aspect: 'Acoplamento com framework',
      node: 'Express está em controllers e services. Trocar de framework exige reescrita.',
      java: 'Domain e Application não importam Spring. Só Infrastructure conhece o framework.'
    },
    {
      aspect: 'Persistência',
      node: 'Service chama Prisma/ORM direto — acoplado ao banco de dados escolhido.',
      java: 'Handler chama uma Port (interface). O banco é um detalhe de implementação trocável.'
    },
    {
      aspect: 'Regras de negócio',
      node: 'Geralmente no Service, misturado com lógica de persistência e HTTP.',
      java: 'Exclusivamente na Entity do Domain. Account.block() lança DomainException se já bloqueada.'
    },
    {
      aspect: 'Testabilidade',
      node: 'Requer mock do ORM e do request/response HTTP para testar o Service.',
      java: 'Domain é testado com Java puro (sem Spring, sem banco). Application usa mock da Port.'
    },
    {
      aspect: 'Inversão de dependência',
      node: 'Menos comum. Dependências importadas diretamente nos módulos.',
      java: 'Estrutural via DI do Spring. Handler recebe AccountRepositoryPort no construtor — nunca a implementação.'
    },
  ];

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

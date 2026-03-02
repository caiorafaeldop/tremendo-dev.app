import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section hero">
      <div class="hero-badge">📚 Projeto de Aprendizado Prático</div>

      <h1 class="hero-title">
        Demonstração de código na stack<br>
        <span class="gradient-text">Java · Spring Boot · Angular · PostgreSQL</span>
      </h1>

      <p class="hero-description">
        Este projeto foi construído para <em>aprendizado hands-on</em>, com foco na
        <strong>comparação direta</strong> entre o ecossistema
        <span class="highlight-node">Node.js / React / Next.js</span> (que já domino)
        e o ecossistema <span class="highlight-java">Java / Spring / Angular</span> (que estou aprendendo).
      </p>

      <p class="hero-quote">
        "Cada seção mostra um conceito da stack Java/Angular lado a lado com o equivalente
        em Node/React. Não é teoria — é código real conectado a um PostgreSQL na nuvem."
      </p>

      <div class="stacks-comparison">
        <div class="stack-column from">
          <span class="stack-label">De onde venho</span>
          <div class="stack-items">
            <span class="tech-badge green" *ngFor="let t of fromStack">{{ t }}</span>
          </div>
        </div>
        <div class="arrow-separator">→</div>
        <div class="stack-column to">
          <span class="stack-label">O que estou aprendendo</span>
          <div class="stack-items">
            <span class="tech-badge" *ngFor="let t of toStack">{{ t }}</span>
          </div>
        </div>
      </div>

      <div class="scroll-indicator">
        <span>SCROLL PARA VER AS COMPARAÇÕES</span>
        <div class="scroll-arrow">↓</div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding-top: 80px;
    }
    .hero-badge {
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.5rem 1.25rem;
      border-radius: 999px;
      border: 1px solid var(--accent-border);
      background: var(--accent-glow);
      color: var(--accent-light);
      margin-bottom: 2rem;
      animation: float 3s ease-in-out infinite;
    }
    .hero-title {
      font-size: 3rem;
      font-weight: 900;
      letter-spacing: -0.04em;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: var(--text);
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--accent) 0%, #C084FC 50%, var(--accent-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-description {
      font-size: 1.15rem;
      color: var(--text-muted);
      max-width: 680px;
      line-height: 1.8;
      margin-bottom: 1.5rem;
    }
    .hero-description strong { color: var(--text); }
    .hero-description em { color: var(--accent-light); font-style: normal; }
    .highlight-node { color: var(--green); font-weight: 600; }
    .highlight-java { color: var(--accent-light); font-weight: 600; }
    .hero-quote {
      font-size: 0.95rem;
      color: var(--text-dim);
      font-style: italic;
      max-width: 550px;
      padding: 1rem 1.5rem;
      border-left: 3px solid var(--accent);
      background: var(--accent-glow);
      border-radius: 0 8px 8px 0;
      margin-bottom: 2.5rem;
      text-align: left;
    }
    .stacks-comparison {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .stack-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .stack-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
      color: var(--text-dim);
    }
    .stack-items {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }
    .arrow-separator {
      font-size: 2rem;
      color: var(--text-dim);
    }
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-dim);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 2px;
    }
    .scroll-arrow {
      font-size: 1.2rem;
      animation: float 2s ease-in-out infinite;
    }
  `]
})
export class HeroComponent {
  fromStack = ['⚛️ React', '▲ Next.js', '🟢 Node.js', '🍃 Express', '🔷 TypeScript', '📦 Prisma'];
  toStack = ['☕ Java 8', '🍃 Spring Boot', '🅰️ Angular 17', '⚡ RxJS', '🐘 PostgreSQL', '💧 Liquibase', '🧱 Clean Arch', '📦 CQRS & DDD', '🛡️ Resilience4j'];
}

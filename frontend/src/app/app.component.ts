import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { StackOverviewComponent } from './sections/stack-overview/stack-overview.component';
import { RxjsDemoComponent } from './sections/rxjs-demo/rxjs-demo.component';
import { CqrsDemoComponent } from './sections/cqrs-demo/cqrs-demo.component';
import { ResilienceDemoComponent } from './sections/resilience-demo/resilience-demo.component';
import { ArchitectureComponent } from './sections/architecture/architecture.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    StackOverviewComponent,
    RxjsDemoComponent,
    CqrsDemoComponent,
    ResilienceDemoComponent,
    ArchitectureComponent
  ],
  template: `
    <!-- Navbar fixa -->
    <nav class="navbar">
      <div class="nav-content">
        <span class="nav-logo">tremendo<span class="accent">.</span>dev</span>
        <div class="nav-links">
          <a href="#hero">Início</a>
          <a href="#stack">Node vs Java</a>
          <a href="#rxjs">RxJS vs React</a>
          <a href="#cqrs">CQRS Demo</a>
          <a href="#resilience">Resiliência</a>
          <a href="#architecture">Arquitetura</a>
        </div>
      </div>
    </nav>

    <app-hero id="hero"></app-hero>
    <app-stack-overview id="stack"></app-stack-overview>
    <app-rxjs-demo id="rxjs"></app-rxjs-demo>
    <app-cqrs-demo id="cqrs"></app-cqrs-demo>
    <app-resilience-demo id="resilience"></app-resilience-demo>
    <app-architecture id="architecture"></app-architecture>

    <!-- Footer -->
    <footer class="footer">
      <p>Projeto de aprendizado: comparando Node.js/React com Java/Angular na prática.</p>
      <p class="footer-sub">Stack usada: Java 8 · Spring Boot 2.7 · Angular 17 · PostgreSQL (NeonDB) · Liquibase · RxJS · CQRS · DDD · Resilience4j</p>
    </footer>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      background: rgba(10, 10, 15, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 0 2rem;
    }
    .nav-content {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }
    .nav-logo { font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; }
    .nav-logo .accent { color: var(--accent); }
    .nav-links { display: flex; gap: 1.5rem; }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--accent-light); }
    .footer {
      text-align: center;
      padding: 4rem 2rem;
      border-top: 1px solid var(--border);
      color: var(--text-dim);
    }
    .footer-sub { font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.6; }
  `]
})
export class AppComponent {}

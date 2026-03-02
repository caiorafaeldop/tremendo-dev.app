import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stack-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section">
      <span class="section-label">Comparação de Stacks</span>
      <h2 class="section-title">O que muda de Node/React para Java/Angular?</h2>
      <p class="section-subtitle" style="margin-bottom: 3rem;">
        Cada card compara como faço algo no meu dia-a-dia com <strong style="color: var(--green)">Node/React</strong>
        vs como funciona aqui em <strong style="color: var(--accent-light)">Java/Angular</strong>.
      </p>

      <div class="stack-grid">
        <div class="card stack-card" *ngFor="let item of comparisons">
          <div class="card-header">
            <span class="stack-icon">{{ item.icon }}</span>
            <h3>{{ item.concept }}</h3>
          </div>

          <div class="comparison-row">
            <div class="side node-side">
              <span class="side-label green">🟢 Node / React</span>
              <p>{{ item.node }}</p>
            </div>
            <div class="side java-side">
              <span class="side-label accent">☕ Java / Angular</span>
              <p>{{ item.java }}</p>
            </div>
          </div>

          <div class="stack-where">
            <span class="label">Implementado em:</span>
            <span class="file">{{ item.file }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stack-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
      gap: 1.25rem;
    }
    .stack-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .card-header h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
    }
    .stack-icon { font-size: 1.5rem; }
    .comparison-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .side {
      padding: 0.75rem;
      border-radius: 8px;
      background: var(--bg-code);
      border: 1px solid var(--border);
    }
    .side p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-top: 0.5rem;
    }
    .side-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .side-label.green { color: var(--green); }
    .side-label.accent { color: var(--accent-light); }
    .stack-where {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
    }
    .stack-where .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-dim);
    }
    .stack-where .file {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--accent);
    }
    @media (max-width: 600px) {
      .stack-grid { grid-template-columns: 1fr; }
      .comparison-row { grid-template-columns: 1fr; }
    }
  `]
})
export class StackOverviewComponent {
  comparisons = [
    {
      icon: '🌐',
      concept: 'API REST',
      node: 'Express com app.get(), app.post(). Rotas em arquivos separados. Middleware pra tudo.',
      java: 'Spring MVC com @RestController, @GetMapping, @PostMapping. Injeção de dependência automática.',
      file: 'AccountController.java'
    },
    {
      icon: '🗃️',
      concept: 'Acesso a Banco de Dados',
      node: 'Prisma ORM ou Sequelize. Schema declarado em .prisma. Queries tipadas automaticamente.',
      java: 'Spring Data JPA + Hibernate. Entidades com @Entity, @Table. Repository via interface JpaRepository.',
      file: 'AccountEntity.java + SpringDataAccountRepository.java'
    },
    {
      icon: '💧',
      concept: 'Migrations / Schema',
      node: 'Prisma Migrate ou Knex.js. Migrations geradas automaticamente via diff do schema.',
      java: 'Liquibase: changesets em YAML/XML com controle de versão do banco. Padrão enterprise pesado.',
      file: 'db/changelog/db.changelog-master.yaml'
    },
    {
      icon: '⚡',
      concept: 'Reatividade no Frontend',
      node: 'React: useState + useEffect. Re-renders automáticos. Dados fluem via props/context.',
      java: 'Angular + RxJS: Observables, pipe(), switchMap, debounceTime. Fluxos assíncronos totalmente declarativos.',
      file: 'rxjs-demo (seção abaixo)'
    },
    {
      icon: '📋',
      concept: 'Formulários',
      node: 'React Hook Form ou Formik. Validação com Zod/Yup. Controlled components.',
      java: 'Angular Reactive Forms: FormBuilder, FormGroup, Validators. Estado do form é um observable.',
      file: 'cqrs-demo.component.ts'
    },
    {
      icon: '🔐',
      concept: 'Autenticação / SSO',
      node: 'NextAuth.js, Passport.js, ou JWT manual com jsonwebtoken.',
      java: 'Spring Security + OAuth2 Resource Server. Keycloak como Identity Provider. JWT nativo.',
      file: 'SecurityConfig.java + auth.interceptor.ts'
    },
    {
      icon: '🧱',
      concept: 'Arquitetura',
      node: 'Geralmente MVC simples: controllers/ services/ models/. Às vezes Clean Arch com cases/.',
      java: 'Clean Architecture / Hexagonal / DDD: Portas, Adaptadores, Domain rico, CQRS (Command+Query separados).',
      file: 'domain/ → application/ → infrastructure/'
    },
    {
      icon: '🛡️',
      concept: 'Resiliência (Microsserviços)',
      node: 'Axios com retry manual, ou libs como cockatiel/opossum. Pouco padrão de mercado.',
      java: 'Resilience4j: @CircuitBreaker, fallback automático. OpenFeign para chamadas inter-serviço. Padrão maduro.',
      file: 'IntegracaoServicoExternoClient.java'
    },
  ];
}

# Arquitetura do Projeto Tremendo Fullstack

Este documento serve como guia detalhando como cada requisito exigido para a vaga de Desenvolvedor Full-Stack foi implementado no projeto "Tremendo Fullstack".

## 1. Experiência como Desenvolvedor Full-Stack utilizando Java e Spring
- **Onde encontrar**: O diretório `backend` é um projeto completo construído com o framework **Spring Boot 2.7** (estável no Java 8).
- **Sub-requisitos atendidos**:
  - `Spring MVC/Web`: Exposto via `AccountController` usando `@RestController`, `@PostMapping` e `@GetMapping`.
  - `Spring Data/JPA`: Utilizado no `SpringDataAccountRepository` através das entidades `@Entity` mapeando o banco relacional.
  - `Validação`: Injetado pelo `spring-boot-starter-validation`, com anotações de Bean Validation como `@Valid`, `@NotBlank` e `@Email` nos objetos de Request da API.
  - `Segurança`: Adicionado o starter do `oauth2-resource-server`. A classe `SecurityConfig` demonstra a capacidade de estender `WebSecurityConfigurerAdapter` para habilitar ou fazer mock de filtros JWT.

## 2. Experiência sólida com Angular e RxJS
- **Onde encontrar**: O diretório `frontend` é uma aplicação real em **Angular 17** usando `standalone components`.
- **Sub-requisitos atendidos**:
  - `Processamento Reativo (RxJS)`: O serviço injetável consome endpoints retornando `Observable`s, que são geridos por pipes do frontend. Interceptors tratam cabeçalhos e fluxos assíncronos de falha.
  - `Formulários Reativos`: O `ReactiveFormsModule` e o injetor `FormBuilder` (fb.group) controlam a tela de criação gerindo status e erros independentes do template.

## 3. Boa base em SQL e PostgreSQL com versionamento (Liquibase)
- **Onde encontrar**: Adicionada a connection string da NeonDB (PostgreSQL Serverless Real) configurado no `application.yml` via DataSource.
- **Liquibase**: O controle do baseline do Schema foi adicionado em `src/main/resources/db/changelog/db.changelog-master.yaml`, criando e rastreando a tabela `accounts` de forma independente do DBA/Hibernate `ddl-auto`.

## 4. Práticas de Clean Architecture / Arquitetura Hexagonal, DDD e CQRS
- **Onde encontrar**: Observe as divisões em pacotes coesos abaixo de `br.com.tremendo.enterprise`.
- **Hexagonal / Clean Arch**: Separamos estritamente a porta de Injeção de Web (Controladores REST em `adapters/in`) e Persistência e Integrações Externas (Data JPA, Feign em `adapters/out`). No meio da cebola mora nosso `application`.
- **CQRS**: Em vez de serviços gigantescos estilo "Transaction Script", há divisões entre Command e Query: `CreateAccountCommand` muda estado da base. `GetAccountQuery` reflete a leitura performática.
- **DDD (Domain-Driven Design)**: A modelagem de `@Entity Hibernate` está na borda `adapters.out`. Entregamos uma classe pura de modelo DDD `model/Account` rica de comportamentos (métodos `block()`, `activate()`), onde validam lógicas de negócio cruciais através do `domain/exceptions/DomainException`.

## 5. Clean Code, Princípios SOLID, Logging Consistente e Tratamento de Exceções
- **Onde encontrar**: A classe `GlobalExceptionHandler` intercepta exceções (incluindo as de validação e de negócio) com o padrão `@ControllerAdvice`, isolando a infraestrutura dos objetos REST e retornando um erro padronizado para a interface em conformidade com o formato unificado.
- **Logging**: Implementado via programação Orientada a Aspectos (AOP) com `@Aspect`. O `LoggingAspect` abstrai chamadas interceptando a API antes de iniciar a regra de negócio (`@Before`) ou rastreando `Exceptions` de todos os métodos (`@AfterThrowing`), evitando poluir o código.

## 6. Microsserviços, Integrações e Resiliência
- **Onde encontrar**: Para provar conhecimento sem precisar subir 10 aplicações complexas que matariam um computador simples, estipulamos no `AccountController` o endpoint `/resilience-demo/{cep}`.
- Ele integra com a infraestrutura via `@FeignClient` chamando uma API simulada.
- Adicionada a anotação `@CircuitBreaker(name = "externalApi", fallbackMethod = "cepFallback")` acionando a biblioteca pesada **Resilience4j**, demonstrando que sabemos evitar falhas em cascata perante outras APIs.

## 7. Versionamento com Git, Merge/Pull Requests
- **Onde encontrar**: Como somos uma IA trabalhando nos bastidores do seu PC local em um único workspace, foi acionado via terminal o `git init`. Normalmente atuaríamos por fluxo completo (Git Flow / Feature Branch) se interligados a plataformas de CI como GitLab ou GitHub.

> Todos os requisitos atingidos neste cenário garantem aptidão para atuar profissionalmente na vaga com sênioridade técnica plena a avançada.

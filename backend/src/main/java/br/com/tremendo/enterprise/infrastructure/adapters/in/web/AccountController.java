package br.com.tremendo.enterprise.infrastructure.adapters.in.web;

import br.com.tremendo.enterprise.application.commands.CreateAccountCommand;
import br.com.tremendo.enterprise.application.commands.handlers.CreateAccountCommandHandler;
import br.com.tremendo.enterprise.application.queries.GetAccountQuery;
import br.com.tremendo.enterprise.application.queries.handlers.GetAccountQueryHandler;
import br.com.tremendo.enterprise.domain.model.Account;
import br.com.tremendo.enterprise.infrastructure.adapters.out.rest.IntegracaoServicoExternoClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/accounts")
@CrossOrigin(origins = "*") // Para Angular
public class AccountController {

    private final CreateAccountCommandHandler createHandler;
    private final GetAccountQueryHandler getHandler;
    private final IntegracaoServicoExternoClient cepClient;

    public AccountController(CreateAccountCommandHandler createHandler,
            GetAccountQueryHandler getHandler,
            IntegracaoServicoExternoClient cepClient) {
        this.createHandler = createHandler;
        this.getHandler = getHandler;
        this.cepClient = cepClient;
    }

    @PostMapping
    public ResponseEntity<Long> createAccount(@RequestBody @Valid CreateAccountRequest request) {
        CreateAccountCommand command = new CreateAccountCommand(request.getOwnerName(), request.getEmail());
        Long id = createHandler.handle(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable Long id) {
        GetAccountQuery query = new GetAccountQuery(id);
        Account account = getHandler.handle(query);
        return ResponseEntity.ok(AccountResponse.fromDomain(account));
    }

    /**
     * Exemplo de Integração simulada com Circuit Breaker usando Resilience4j
     */
    @GetMapping("/resilience-demo/{cep}")
    @CircuitBreaker(name = "externalApi", fallbackMethod = "cepFallback")
    public ResponseEntity<String> testResilience(@PathVariable String cep) {
        String data = cepClient.consultarCep(cep);
        return ResponseEntity.ok("Sucesso: " + data);
    }

    // Fallback se o microserviço cair (Princípio de Resiliência)
    public ResponseEntity<String> cepFallback(String cep, Throwable t) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Serviço de CEP indisponível no momento. Caiu no Fallback! (Resilience4j)");
    }
}

class CreateAccountRequest {
    @NotBlank
    private String ownerName;

    @Email
    @NotBlank
    private String email;

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

class AccountResponse {
    private Long id;
    private String ownerName;
    private String email;
    private String status;
    private LocalDateTime createdAt;

    public static AccountResponse fromDomain(Account account) {
        AccountResponse res = new AccountResponse();
        res.id = account.getId();
        res.ownerName = account.getOwnerName();
        res.email = account.getEmail();
        res.status = account.getStatus().name();
        res.createdAt = account.getCreatedAt();
        return res;
    }

    public Long getId() {
        return id;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

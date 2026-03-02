package br.com.tremendo.enterprise.application.queries.handlers;

import br.com.tremendo.enterprise.application.ports.out.AccountRepositoryPort;
import br.com.tremendo.enterprise.application.queries.GetAccountQuery;
import br.com.tremendo.enterprise.domain.exceptions.DomainException;
import br.com.tremendo.enterprise.domain.model.Account;
import org.springframework.stereotype.Service;

@Service
public class GetAccountQueryHandler {

    private final AccountRepositoryPort repositoryPort;

    public GetAccountQueryHandler(AccountRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    public Account handle(GetAccountQuery query) {
        return repositoryPort.findById(query.getAccountId())
                .orElseThrow(() -> new DomainException("Account not found for id: " + query.getAccountId()));
    }
}

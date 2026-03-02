package br.com.tremendo.enterprise.application.commands.handlers;

import br.com.tremendo.enterprise.application.commands.CreateAccountCommand;
import br.com.tremendo.enterprise.application.ports.out.AccountRepositoryPort;
import br.com.tremendo.enterprise.domain.exceptions.DomainException;
import br.com.tremendo.enterprise.domain.model.Account;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateAccountCommandHandler {

    private final AccountRepositoryPort repositoryPort;

    public CreateAccountCommandHandler(AccountRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Transactional
    public Long handle(CreateAccountCommand command) {
        if (repositoryPort.existsByEmail(command.getEmail())) {
            throw new DomainException("Email is already registered.");
        }

        Account newAccount = Account.createNew(command.getOwnerName(), command.getEmail());
        Account savedAccount = repositoryPort.save(newAccount);
        return savedAccount.getId();
    }
}

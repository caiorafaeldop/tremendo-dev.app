package br.com.tremendo.enterprise.infrastructure.adapters.out.persistence;

import br.com.tremendo.enterprise.application.ports.out.AccountRepositoryPort;
import br.com.tremendo.enterprise.domain.model.Account;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AccountPersistenceAdapter implements AccountRepositoryPort {

    private final SpringDataAccountRepository repository;

    public AccountPersistenceAdapter(SpringDataAccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public Account save(Account account) {
        AccountEntity entity = AccountEntity.fromDomain(account);
        entity = repository.save(entity);
        return entity.toDomain();
    }

    @Override
    public Optional<Account> findById(Long id) {
        return repository.findById(id).map(AccountEntity::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }
}

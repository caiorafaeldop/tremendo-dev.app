package br.com.tremendo.enterprise.application.ports.out;

import br.com.tremendo.enterprise.domain.model.Account;
import java.util.Optional;

public interface AccountRepositoryPort {
    Account save(Account account);

    Optional<Account> findById(Long id);

    boolean existsByEmail(String email);
}

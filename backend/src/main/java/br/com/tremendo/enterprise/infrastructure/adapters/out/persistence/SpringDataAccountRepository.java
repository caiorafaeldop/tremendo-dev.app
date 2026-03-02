package br.com.tremendo.enterprise.infrastructure.adapters.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataAccountRepository extends JpaRepository<AccountEntity, Long> {

    boolean existsByEmail(String email);
}

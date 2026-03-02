package br.com.tremendo.enterprise.infrastructure.adapters.out.persistence;

import br.com.tremendo.enterprise.domain.model.Account;
import br.com.tremendo.enterprise.domain.model.AccountStatus;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ownerName;

    private String email;

    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    private LocalDateTime createdAt;

    public AccountEntity() {
    }

    public static AccountEntity fromDomain(Account domain) {
        AccountEntity entity = new AccountEntity();
        entity.id = domain.getId();
        entity.ownerName = domain.getOwnerName();
        entity.email = domain.getEmail();
        entity.status = domain.getStatus();
        entity.createdAt = domain.getCreatedAt();
        return entity;
    }

    public Account toDomain() {
        return new Account(id, ownerName, email, status, createdAt);
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

    public AccountStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

package br.com.tremendo.enterprise.domain.model;

import br.com.tremendo.enterprise.domain.exceptions.DomainException;

import java.time.LocalDateTime;

public class Account {

    private Long id;
    private String ownerName;
    private String email;
    private AccountStatus status;
    private LocalDateTime createdAt;

    public Account(Long id, String ownerName, String email, AccountStatus status, LocalDateTime createdAt) {
        validate(ownerName, email);
        this.id = id;
        this.ownerName = ownerName;
        this.email = email;
        this.status = status != null ? status : AccountStatus.PENDING_VERIFICATION;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Account createNew(String ownerName, String email) {
        return new Account(null, ownerName, email, AccountStatus.PENDING_VERIFICATION, null);
    }

    public void block() {
        if (this.status == AccountStatus.BLOCKED) {
            throw new DomainException("Account is already blocked.");
        }
        this.status = AccountStatus.BLOCKED;
    }

    public void activate() {
        if (this.status == AccountStatus.ACTIVE) {
            throw new DomainException("Account is already active.");
        }
        this.status = AccountStatus.ACTIVE;
    }

    private void validate(String ownerName, String email) {
        if (ownerName == null || ownerName.trim().isEmpty()) {
            throw new DomainException("Owner name cannot be empty.");
        }
        if (email == null || !email.contains("@")) {
            throw new DomainException("Invalid email format.");
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

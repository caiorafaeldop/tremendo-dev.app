package br.com.tremendo.enterprise.application.queries;

public class GetAccountQuery {
    private final Long accountId;

    public GetAccountQuery(Long accountId) {
        this.accountId = accountId;
    }

    public Long getAccountId() {
        return accountId;
    }
}

package br.com.tremendo.enterprise.application.commands;

public class CreateAccountCommand {
    private final String ownerName;
    private final String email;

    public CreateAccountCommand(String ownerName, String email) {
        this.ownerName = ownerName;
        this.email = email;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public String getEmail() {
        return email;
    }
}

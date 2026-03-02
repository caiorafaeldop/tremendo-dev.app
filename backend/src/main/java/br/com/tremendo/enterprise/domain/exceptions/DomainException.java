package br.com.tremendo.enterprise.domain.exceptions;

public class DomainException extends RuntimeException {

    public DomainException(String message) {
        super(message);
    }
}

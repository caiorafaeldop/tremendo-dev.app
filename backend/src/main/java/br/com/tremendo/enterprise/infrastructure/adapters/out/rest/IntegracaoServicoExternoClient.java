package br.com.tremendo.enterprise.infrastructure.adapters.out.rest;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Cliente Feign para demonstrar integração entre serviços (Microservices).
 * Consome uma API mock de CEP como exemplo.
 */
@FeignClient(name = "externalApi", url = "https://viacep.com.br/ws")
public interface IntegracaoServicoExternoClient {

    @GetMapping("/{cep}/json")
    String consultarCep(@PathVariable("cep") String cep);
}

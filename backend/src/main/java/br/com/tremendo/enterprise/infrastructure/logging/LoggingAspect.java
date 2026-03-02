package br.com.tremendo.enterprise.infrastructure.logging;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Aspecto de Logging Consistente usando Spring AOP.
 */
@Aspect
@Component
public class LoggingAspect {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Before("within(br.com.tremendo.enterprise.infrastructure.adapters.in.web..*)")
    public void logBeforeRequest(JoinPoint joinPoint) {
        log.info("Request API: {}.{}()", joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName());
    }

    @AfterThrowing(pointcut = "within(br.com.tremendo.enterprise..*)", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        log.error("Exception in {}.{}() with cause = {}", joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(), e.getMessage());
    }
}

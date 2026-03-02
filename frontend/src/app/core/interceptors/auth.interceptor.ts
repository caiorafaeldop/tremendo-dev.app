import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Simulação de injeção de Token SSO (Ex: Keycloak JWT)
  const authToken = 'mock-jwt-token-123';
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Tratamento global de erros para chamadas HTTP a la RxJS
      console.error('Interceptor capturou um erro HTTP:', error);
      if (error.status === 401) {
        // Exemplo: Redirecionar para o Keycloak
        console.warn('Não autorizado. O token expirou?');
      }
      return throwError(() => new Error('Ocorreu um erro na requisição. Verifique o console.'));
    })
  );
};

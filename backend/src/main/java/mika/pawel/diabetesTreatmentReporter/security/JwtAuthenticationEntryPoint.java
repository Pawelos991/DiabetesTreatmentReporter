package mika.pawel.diabetesTreatmentReporter.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;


/**
 * Implementacja interfejsu {@link AuthenticationEntryPoint}, wywołana za każdym razem gdy nieuwierzytelniony
 * użytkownik próbuje uzyskać dostęp do zabezpieczonego zasobu.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

  @Override
  public void commence(HttpServletRequest httpServletRequest,
                       HttpServletResponse httpServletResponse,
                       AuthenticationException e) throws IOException {
    logger.error("Próba nieautoryzowanego dostępu do zasobów - {}", e.getLocalizedMessage());
    httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    httpServletResponse.getWriter().write("{}");
  }
}

package mika.pawel.diabetesTreatmentReporter.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtTokenProvider tokenProvider;
  private final UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      String jwt = tokenProvider.getTokenFromRequest(request);

      if (StringUtils.hasText(jwt)) {
        JWTValidationResult result = tokenProvider.validateToken(jwt);

        if (!JWTValidationResult.VALID.equals(result)) {
          return;
        }

        String username = tokenProvider.getUsernameFromJWT(jwt);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities()
        );
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Date tokenExpiryDate = tokenProvider.getTokenExpiryDate(jwt);
        long ttl = ChronoUnit.SECONDS.between(
            LocalDateTime.now(),
            tokenExpiryDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
        );
        response.addHeader("X-SESSION-TTL", Long.toString(ttl));
      }
    } catch (Exception ex) {
      logger.error("Could not set user authentication in security context",
          ex);
    }

    filterChain.doFilter(request, response);
  }
}

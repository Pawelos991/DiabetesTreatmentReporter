package mika.pawel.diabetesTreatmentReporter.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dto.BasicResponse;
import mika.pawel.diabetesTreatmentReporter.security.AuthenticationResponse;
import mika.pawel.diabetesTreatmentReporter.security.CustomUserDetailsService;
import mika.pawel.diabetesTreatmentReporter.security.JwtTokenProvider;
import mika.pawel.diabetesTreatmentReporter.security.UserAuthenticationResult;
import mika.pawel.diabetesTreatmentReporter.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final CustomUserDetailsService userDetailsService;
  private final JwtTokenProvider tokenProvider;
  private final CookieService cookieService;

  public UserAuthenticationResult loginUser(String login) {
    UserPrincipal principal = (UserPrincipal) userDetailsService.loadUserByUsername(login);
    return tokenProvider.generateToken(principal);
  }

  @Transactional(readOnly = true)
  public AuthenticationResponse checkAuthentication(HttpServletRequest request, UserPrincipal userPrincipal) {
    return new AuthenticationResponse(true, userDetailsService.getLoggedUser(userPrincipal),
        String.valueOf(tokenProvider.getTokenExpiryDate(tokenProvider.getTokenFromRequest(request)).getTime()));
  }

  public void logoutUser(
      HttpServletRequest request,
      HttpServletResponse response
  ) {
    String token = tokenProvider.getTokenFromRequest(request);
    if (token != null) {
      cookieService.setCookieHeader(response, cookieService.createRemovalCookie());
    }
    var context = SecurityContextHolder.getContext();
    context.setAuthentication(null);
  }
}

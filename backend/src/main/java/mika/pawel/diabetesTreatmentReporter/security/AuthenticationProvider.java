package mika.pawel.diabetesTreatmentReporter.security;

import java.util.Collection;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.exception.IncorrectUsernameOrPasswordException;
import mika.pawel.diabetesTreatmentReporter.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationProvider {

  private final CustomUserDetailsService customUserDetailsService;
  private final UserService userService;

  public Authentication authenticate(String username, String password) {
    if (userService.checkUsernameAndPassword(username, password)) {
      return prepareAuthentication(username);
    }
    throw new IncorrectUsernameOrPasswordException();
  }

  private Authentication prepareAuthentication(String username) {
    return new Authentication() {
      @Override
      public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
      }

      @Override
      public Object getCredentials() {
        return null;
      }

      @Override
      public Object getDetails() {
        return null;
      }

      @Override
      public Object getPrincipal() {
        return customUserDetailsService.loadUserByUsername(username);
      }

      @Override
      public boolean isAuthenticated() {
        return true;
      }

      @Override
      public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        // do nothing
      }

      @Override
      public String getName() {
        return username;
      }
    };
  }
}

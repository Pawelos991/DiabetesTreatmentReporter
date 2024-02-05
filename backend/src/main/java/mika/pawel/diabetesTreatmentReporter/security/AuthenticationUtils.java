package mika.pawel.diabetesTreatmentReporter.security;

import java.util.Collection;
import mika.pawel.diabetesTreatmentReporter.enums.Authority;
import org.springframework.security.core.Authentication;

public class AuthenticationUtils {

  public static boolean authenticationDoesntHaveAnyOfPermissions(
      Authentication authentication, Collection<Authority> requiredAuthorities
  ) {
    return requiredAuthorities.stream()
        .noneMatch(authority -> authority.getName().equals(((UserPrincipal)authentication.getPrincipal()).getRole()));
  }

}

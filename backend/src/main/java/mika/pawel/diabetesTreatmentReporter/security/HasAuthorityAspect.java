package mika.pawel.diabetesTreatmentReporter.security;

import java.util.List;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.exception.ForbiddenException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class HasAuthorityAspect {

  @Before("@annotation(hasAuthority)")
  public void checkPermission(JoinPoint joinPoint, HasAuthority hasAuthority) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (AuthenticationUtils
        .authenticationDoesntHaveAnyOfPermissions(authentication, List.of(hasAuthority.value()))) {
      throw new ForbiddenException();
    }
  }
}

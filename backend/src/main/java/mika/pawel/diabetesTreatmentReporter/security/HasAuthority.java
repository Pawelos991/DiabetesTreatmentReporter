package mika.pawel.diabetesTreatmentReporter.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import mika.pawel.diabetesTreatmentReporter.enums.Authority;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface HasAuthority {
  Authority[] value();
}

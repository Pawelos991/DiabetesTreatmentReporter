package mika.pawel.diabetesTreatmentReporter.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class IncorrectUsernameOrPasswordException extends RuntimeException {
  public IncorrectUsernameOrPasswordException() {
    super("Podana nazwa użytkownika lub hasło jest nieprawidłowe");
  }
}

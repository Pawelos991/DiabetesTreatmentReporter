package mika.pawel.diabetesTreatmentReporter.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mika.pawel.diabetesTreatmentReporter.exception.ForbiddenException;
import mika.pawel.diabetesTreatmentReporter.exception.IncorrectUsernameOrPasswordException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import mika.pawel.diabetesTreatmentReporter.dto.error.ErrorResponse;
import mika.pawel.diabetesTreatmentReporter.exception.BadRequestException;

@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class ControllerExceptionHandler {
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  @ExceptionHandler
  @ResponseBody
  ErrorResponse handleAppException(Exception e) {
    return new ErrorResponse("Wystąpił niespodziewany błąd serwera");
  }
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({BadRequestException.class, IncorrectUsernameOrPasswordException.class})
  @ResponseBody
  ErrorResponse handleBadRequestException(BadRequestException e) {
    return new ErrorResponse(e.getMessage());
  }

  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ExceptionHandler(ForbiddenException.class)
  @ResponseBody
  ErrorResponse handleForbiddenException(ForbiddenException e) {
    return new ErrorResponse(e.getMessage());
  }

}

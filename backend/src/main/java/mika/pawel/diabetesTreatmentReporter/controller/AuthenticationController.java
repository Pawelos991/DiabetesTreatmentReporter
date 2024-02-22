package mika.pawel.diabetesTreatmentReporter.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dto.BasicResponse;
import mika.pawel.diabetesTreatmentReporter.dto.user.UserLoginRequest;
import mika.pawel.diabetesTreatmentReporter.security.AuthenticationProvider;
import mika.pawel.diabetesTreatmentReporter.security.AuthenticationResponse;
import mika.pawel.diabetesTreatmentReporter.security.UserAuthenticationResult;
import mika.pawel.diabetesTreatmentReporter.security.UserPrincipal;
import mika.pawel.diabetesTreatmentReporter.service.AuthenticationService;
import mika.pawel.diabetesTreatmentReporter.service.CookieService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("${apiV1}/authentication")
@Tag(name = "Authentication")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationProvider authenticationProvider;
  private final AuthenticationService authenticationService;
  private final CookieService cookieService;

  @PostMapping("/login")
  public ResponseEntity<BasicResponse> login(@RequestBody @Valid UserLoginRequest userLoginRequest,
                             HttpServletResponse response) {
    Authentication authentication = authenticationProvider.authenticate(userLoginRequest);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserAuthenticationResult result = authenticationService.loginUser(authentication.getName());
    response.addHeader("Set-Cookie", cookieService.createCookieWithToken(result.getToken()).toString());

    return ResponseEntity.ok(BasicResponse.ok());
  }

  @GetMapping("/check")
  public ResponseEntity<AuthenticationResponse> checkAuthentication(HttpServletRequest request,
                                                                    @AuthenticationPrincipal
                                                                    UserPrincipal userPrincipal) {
    if (userPrincipal == null) {
      return ResponseEntity.ok(new AuthenticationResponse(false, null, null));
    }
    return ResponseEntity.ok(authenticationService.checkAuthentication(request, userPrincipal));
  }

  @PostMapping("/logout")
  public ResponseEntity<BasicResponse> logout(HttpServletRequest request, HttpServletResponse response) {
    authenticationService.logoutUser(request, response);
    return ResponseEntity.ok(BasicResponse.ok());
  }
}

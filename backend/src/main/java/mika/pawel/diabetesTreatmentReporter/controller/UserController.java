package mika.pawel.diabetesTreatmentReporter.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dto.user.UserRegisterRequest;
import mika.pawel.diabetesTreatmentReporter.dto.user.UserResponse;
import mika.pawel.diabetesTreatmentReporter.enums.Authority;
import mika.pawel.diabetesTreatmentReporter.security.HasAuthority;
import mika.pawel.diabetesTreatmentReporter.security.UserPrincipal;
import mika.pawel.diabetesTreatmentReporter.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("${apiV1}/users")
@Tag(name = "User")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @GetMapping
  @HasAuthority({Authority.DOCTOR, Authority.ADMINISTRATOR})
  public ResponseEntity<List<UserResponse>> getUsers(@AuthenticationPrincipal UserPrincipal userPrincipal) {
    return ResponseEntity.ok(userService.getUsers(userPrincipal));
  }

  @GetMapping("/{id}")
  @HasAuthority({Authority.DOCTOR, Authority.ADMINISTRATOR})
  public ResponseEntity<UserResponse> getUser(@PathVariable Integer id,
                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {
    return ResponseEntity.ok(userService.getUser(id, userPrincipal));
  }

  @PostMapping("/register")
  @HasAuthority(Authority.ADMINISTRATOR)
  public ResponseEntity<UserResponse> registerUser(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
    return ResponseEntity.ok(userService.registerUser(userRegisterRequest));
  }

  @GetMapping("/doctors")
  @HasAuthority({Authority.ADMINISTRATOR, Authority.DOCTOR})
  public ResponseEntity<List<UserResponse>> getDoctors() {
    return ResponseEntity.ok(userService.getDoctors());
  }
}

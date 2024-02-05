package mika.pawel.diabetesTreatmentReporter.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dto.role.RoleResponse;
import mika.pawel.diabetesTreatmentReporter.enums.Authority;
import mika.pawel.diabetesTreatmentReporter.security.HasAuthority;
import mika.pawel.diabetesTreatmentReporter.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("${apiV1}/roles")
@Tag(name = "Roles")
@RequiredArgsConstructor
public class RoleController {
  private final RoleService roleService;

  @GetMapping
  @HasAuthority({Authority.ADMINISTRATOR, Authority.DOCTOR})
  public ResponseEntity<List<RoleResponse>> getRoles() {
    return ResponseEntity.ok(roleService.getRoles());
  }
}

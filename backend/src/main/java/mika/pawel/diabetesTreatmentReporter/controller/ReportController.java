package mika.pawel.diabetesTreatmentReporter.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dto.report.ReportRequest;
import mika.pawel.diabetesTreatmentReporter.dto.report.ReportResponse;
import mika.pawel.diabetesTreatmentReporter.enums.Authority;
import mika.pawel.diabetesTreatmentReporter.security.HasAuthority;
import mika.pawel.diabetesTreatmentReporter.security.UserPrincipal;
import mika.pawel.diabetesTreatmentReporter.service.ReportService;
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
@RequestMapping("${apiV1}/reports")
@Tag(name = "Report")
@RequiredArgsConstructor
public class ReportController {
  private final ReportService reportService;

  @GetMapping
  @HasAuthority({Authority.DOCTOR, Authority.PATIENT})
  public ResponseEntity<List<ReportResponse>> getReports(@AuthenticationPrincipal UserPrincipal userPrincipal) {
    return ResponseEntity.ok(reportService.getAll(userPrincipal));
  }

  @GetMapping("/{id}")
  @HasAuthority({Authority.DOCTOR, Authority.PATIENT})
  public ResponseEntity<ReportResponse> getReport(@PathVariable Integer id,
                                                  @AuthenticationPrincipal UserPrincipal userPrincipal) {
    return ResponseEntity.ok(reportService.getReport(id, userPrincipal));
  }

  @PostMapping("/register")
  @HasAuthority({Authority.PATIENT})
  public ResponseEntity<ReportResponse> registerReport(@RequestBody @Valid ReportRequest reportRequest,
                                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
    return ResponseEntity.ok(reportService.registerReport(reportRequest, userPrincipal));
  }
}

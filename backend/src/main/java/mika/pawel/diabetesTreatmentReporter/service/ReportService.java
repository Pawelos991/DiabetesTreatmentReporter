package mika.pawel.diabetesTreatmentReporter.service;

import com.google.gson.Gson;
import java.util.List;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dao.ReportRepository;
import mika.pawel.diabetesTreatmentReporter.dao.UserRepository;
import mika.pawel.diabetesTreatmentReporter.dto.report.ReportRequest;
import mika.pawel.diabetesTreatmentReporter.dto.report.ReportResponse;
import mika.pawel.diabetesTreatmentReporter.enums.Authority;
import mika.pawel.diabetesTreatmentReporter.exception.BadRequestException;
import mika.pawel.diabetesTreatmentReporter.exception.ForbiddenException;
import mika.pawel.diabetesTreatmentReporter.mapper.ReportEntityMapper;
import mika.pawel.diabetesTreatmentReporter.model.ReportEntity;
import mika.pawel.diabetesTreatmentReporter.model.UserEntity;
import mika.pawel.diabetesTreatmentReporter.security.UserPrincipal;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {
  private final ReportRepository reportRepository;
  private final UserRepository userRepository;
  private final ReportEntityMapper reportEntityMapper;
  private final Gson gson = new Gson();

  @Transactional(readOnly = true)
  public List<ReportResponse> getAll(UserPrincipal userPrincipal) {
    if (Authority.DOCTOR.getName().equals(userPrincipal.getRole())) {
      return reportRepository.findAllByUserIdInAndDeletedFalseOrderByIdDesc(
          userRepository.findAllByDoctorId(userPrincipal.getId()).stream().map(UserEntity::getId).toList()
      ).stream().map(reportEntityMapper::toResponse).toList();
    } else {
      return reportRepository.findAllByUserIdAndDeletedFalseOrderByIdDesc(userPrincipal.getId())
          .stream().map(reportEntityMapper::toResponse).toList();
    }
  }

  @Transactional(readOnly = true)
  public ReportResponse getReport(Integer reportId, UserPrincipal userPrincipal) {
    ReportEntity reportEntity = reportRepository.findById(reportId).orElseThrow(BadRequestException::new);
    if (Authority.DOCTOR.getName().equals(userPrincipal.getRole())
        && !reportEntity.getUser().getDoctor().getId().equals(userPrincipal.getId())) {
      throw new ForbiddenException();
    } else if (Authority.PATIENT.getName().equals(userPrincipal.getRole())
        && !reportEntity.getUser().getId().equals(userPrincipal.getId())) {
      throw new ForbiddenException();
    }
    return reportEntityMapper.toResponse(reportEntity);
  }

  @Transactional
  public ReportResponse registerReport(ReportRequest reportRequest, UserPrincipal userPrincipal) {
    UserEntity userEntity = userRepository.findById(userPrincipal.getId()).orElseThrow(BadRequestException::new);
    verifyChecksum(reportRequest, userEntity.getUsername());
    reportRepository.saveAll(reportRepository.findAllByUserIdAndYearAndMonthAndDeletedFalse(
        userEntity.getId(),
        reportRequest.getReportBase().getYear(),
        reportRequest.getReportBase().getMonth()
        ).stream().peek(report -> report.setDeleted(true)).toList()
    );
    ReportEntity reportEntity = reportEntityMapper.fromRequest(reportRequest);
    reportEntity.setUser(userEntity);
    reportRepository.save(reportEntity);
    return reportEntityMapper.toResponse(reportEntity);
  }

  private void verifyChecksum(ReportRequest reportRequest, String username) {
    String checksum = DigestUtils.sha256Hex(gson.toJson(reportRequest.getReportBase()) + username);
    if (!checksum.equals(reportRequest.getChecksum())) {
      throw new BadRequestException("Suma kontrolna się nie zgadza");
    }
  }
}

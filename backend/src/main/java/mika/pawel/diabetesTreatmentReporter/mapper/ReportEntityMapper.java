package mika.pawel.diabetesTreatmentReporter.mapper;

import mika.pawel.diabetesTreatmentReporter.dto.report.ReportRequest;
import mika.pawel.diabetesTreatmentReporter.dto.report.ReportResponse;
import mika.pawel.diabetesTreatmentReporter.model.ReportEntity;
import mika.pawel.diabetesTreatmentReporter.model.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ReportEntityMapper {
  ReportEntityMapper INSTANCE = Mappers.getMapper(ReportEntityMapper.class);

  @Mapping(target = "patientsName", source = "reportEntity.user.fullName")
  ReportResponse toResponse(ReportEntity reportEntity);

  @Mapping(target = "year", source = "reportRequest.reportBase.year")
  @Mapping(target = "month", source = "reportRequest.reportBase.month")
  @Mapping(target = "avgSugarLevel", source = "reportRequest.reportBase.avgSugarLevel")
  @Mapping(target = "timeInTarget", source = "reportRequest.reportBase.timeInTarget")
  @Mapping(target = "timeBelowTarget", source = "reportRequest.reportBase.timeBelowTarget")
  @Mapping(target = "timeAboveTarget", source = "reportRequest.reportBase.timeAboveTarget")
  @Mapping(target = "bodyWeight", source = "reportRequest.reportBase.bodyWeight")
  @Mapping(target = "deleted", constant = "false")
  ReportEntity fromRequest(ReportRequest reportRequest);

}

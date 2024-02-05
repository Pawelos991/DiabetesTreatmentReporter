package mika.pawel.diabetesTreatmentReporter.mapper;

import mika.pawel.diabetesTreatmentReporter.dto.role.RoleResponse;
import mika.pawel.diabetesTreatmentReporter.model.RoleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface RoleEntityMapper {
  RoleEntityMapper INSTANCE = Mappers.getMapper(RoleEntityMapper.class);

  RoleResponse toResponse(RoleEntity roleEntity);

}

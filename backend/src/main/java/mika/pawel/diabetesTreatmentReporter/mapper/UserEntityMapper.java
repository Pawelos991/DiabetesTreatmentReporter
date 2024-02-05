package mika.pawel.diabetesTreatmentReporter.mapper;

import mika.pawel.diabetesTreatmentReporter.dto.user.UserRegisterRequest;
import mika.pawel.diabetesTreatmentReporter.dto.user.UserResponse;
import mika.pawel.diabetesTreatmentReporter.model.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UserEntityMapper {
  UserEntityMapper INSTANCE = Mappers.getMapper(UserEntityMapper.class);

  @Mapping(target = "role", source = "userEntity.role.name")
  @Mapping(target = "doctorName", source = "userEntity.doctor.fullName")
  @Mapping(target = "doctorId", source = "userEntity.doctor.id")
  UserResponse toResponse(UserEntity userEntity);

  @Mapping(target = "salt", source = "userRegisterRequest.username")
  UserEntity fromRegisterRequest(UserRegisterRequest userRegisterRequest);
}

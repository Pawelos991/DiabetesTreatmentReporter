package mika.pawel.diabetesTreatmentReporter.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dao.RoleRepository;
import mika.pawel.diabetesTreatmentReporter.dao.UserRepository;
import mika.pawel.diabetesTreatmentReporter.dto.user.UserRegisterRequest;
import mika.pawel.diabetesTreatmentReporter.dto.user.UserResponse;
import mika.pawel.diabetesTreatmentReporter.enums.Authority;
import mika.pawel.diabetesTreatmentReporter.exception.BadRequestException;
import mika.pawel.diabetesTreatmentReporter.exception.ForbiddenException;
import mika.pawel.diabetesTreatmentReporter.mapper.UserEntityMapper;
import mika.pawel.diabetesTreatmentReporter.model.UserEntity;
import mika.pawel.diabetesTreatmentReporter.security.UserPrincipal;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final UserEntityMapper userEntityMapper;
  private final RoleRepository roleRepository;

  public boolean checkUsernameAndPassword(String username, String password) {
    try {
      UserEntity user = userRepository.findByUsername(username).orElseThrow(BadRequestException::new);
      return user.getPassword().equals(DigestUtils.sha256Hex(password + user.getSalt()));
    } catch (Exception ignored) {
      return false;
    }
  }

  @Transactional(readOnly = true)
  public List<UserResponse> getUsers(UserPrincipal userPrincipal) {
    if (userPrincipal.getRole().equals(Authority.ADMINISTRATOR.getName())) {
      return userRepository.findAll().stream().map(userEntityMapper::toResponse).toList();
    } else {
      return userRepository.findAllByDoctorId(userPrincipal.getId()).stream().map(userEntityMapper::toResponse).toList();
    }
  }

  @Transactional(readOnly = true)
  public UserResponse getUser(Integer id, UserPrincipal userPrincipal) {
    UserEntity userEntity = userRepository.findById(id).orElseThrow(BadRequestException::new);
    if (userPrincipal.getRole().equals(Authority.DOCTOR.getName())
        && (userEntity.getDoctor() == null || !userPrincipal.getId().equals(userEntity.getDoctor().getId()))) {
      throw new ForbiddenException();
    }
    return userEntityMapper.toResponse(userEntity);
  }

  @Transactional
  public UserResponse registerUser(UserRegisterRequest userRegisterRequest) {
    if (userRepository.findByUsername(userRegisterRequest.getUsername()).isPresent()) {
      throw new BadRequestException("Nazwa użytkownika jest zajęta");
    }
    UserEntity user = userEntityMapper.fromRegisterRequest(userRegisterRequest);
    user.setPassword(DigestUtils.sha256Hex(user.getPassword() + user.getSalt()));
    if (userRegisterRequest.getDoctorId() != null) {
      user.setDoctor(userRepository.findById(userRegisterRequest.getDoctorId()).orElseThrow(BadRequestException::new));
    }
    user.setRole(roleRepository.findById(userRegisterRequest.getRoleCode()).orElseThrow(BadRequestException::new));
    userRepository.save(user);
    return userEntityMapper.toResponse(user);
  }

  @Transactional(readOnly = true)
  public List<UserResponse> getDoctors() {
    return userRepository.findAllByRoleCode('D').stream().map(userEntityMapper::toResponse).toList();
  }
}

package mika.pawel.diabetesTreatmentReporter.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dao.RoleRepository;
import mika.pawel.diabetesTreatmentReporter.dto.role.RoleResponse;
import mika.pawel.diabetesTreatmentReporter.mapper.RoleEntityMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {
  private final RoleRepository roleRepository;
  private final RoleEntityMapper roleEntityMapper;

  public List<RoleResponse> getRoles() {
    return roleRepository.findAll().stream().map(roleEntityMapper::toResponse).toList();
  }
}

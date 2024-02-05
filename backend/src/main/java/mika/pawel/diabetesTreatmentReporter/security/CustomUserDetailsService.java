package mika.pawel.diabetesTreatmentReporter.security;

import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dao.UserRepository;
import mika.pawel.diabetesTreatmentReporter.dto.user.UserResponse;
import mika.pawel.diabetesTreatmentReporter.mapper.UserEntityMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;
  private final UserEntityMapper userEntityMapper;

  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository.findByUsername(username)
        .map(UserPrincipal::fromEntity).orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono użytkownika!"));
  }

  @Transactional(readOnly = true)
  public UserResponse getLoggedUser(final UserPrincipal userPrincipal) {
    return userRepository.findById(userPrincipal.getId())
        .map(userEntityMapper::toResponse)
        .orElseThrow(RuntimeException::new);
  }
}

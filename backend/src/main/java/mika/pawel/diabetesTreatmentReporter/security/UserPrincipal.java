package mika.pawel.diabetesTreatmentReporter.security;

import java.util.Collection;
import lombok.Getter;
import lombok.Setter;
import mika.pawel.diabetesTreatmentReporter.model.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
@Setter
public class UserPrincipal implements UserDetails {
  private Integer id;
  private String username;
  private String role;

  private UserPrincipal(Integer id, String username, String role) {
    this.id = id;
    this.username = username;
    this.role = role;
  }

  public static UserPrincipal fromEntity(UserEntity entity) {
    return new UserPrincipal(entity.getId(), entity.getUsername(), entity.getRole().getName());
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return null;
  }

  @Override
  public String getPassword() {
    return null;
  }

  @Override
  public boolean isAccountNonExpired() {
    return false;
  }

  @Override
  public boolean isAccountNonLocked() {
    return false;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return false;
  }

  @Override
  public boolean isEnabled() {
    return false;
  }
}

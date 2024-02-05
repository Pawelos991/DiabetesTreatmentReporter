package mika.pawel.diabetesTreatmentReporter.dto.user;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
  @NotNull
  private String username;
  @NotNull
  private String name;
  @NotNull
  private String surname;
  private Integer doctorId;
  @NotNull
  private String password;
  @NotNull
  private Character roleCode;
}

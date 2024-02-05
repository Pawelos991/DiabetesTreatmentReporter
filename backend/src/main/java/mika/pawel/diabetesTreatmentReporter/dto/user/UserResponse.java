package mika.pawel.diabetesTreatmentReporter.dto.user;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
  @NotNull
  private Integer id;
  @NotNull
  private String username;
  @NotNull
  private String role;
  @NotNull
  private String name;
  @NotNull
  private String surname;
  private String doctorName;
  private Integer doctorId;
}

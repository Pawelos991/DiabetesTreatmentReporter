package mika.pawel.diabetesTreatmentReporter.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@RequiredArgsConstructor
@Configuration
public class MapperConfig {

  private final ObjectMapper objectMapper;

  @PostConstruct
  private void configureObjectMapper() {
    objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
  }
}
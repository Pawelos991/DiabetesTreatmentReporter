package mika.pawel.diabetesTreatmentReporter.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.StringSchema;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import mika.pawel.diabetesTreatmentReporter.enums.Authority;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
  private final String appVersion;
  private final String appName;

  /**
   * Konstruktor dla kontenera dependency injection.
   */
  public OpenApiConfig(@Value("${app.version}") String appVersion,
                       @Value("${app.short-name}") String appShortName,
                       @Value("${app.name}") String appName
                       ) {
    this.appVersion = appVersion;
    this.appName = appShortName + " – " + appName;
  }
  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI()
        .info(new Info().title(appName)
            .version(appVersion));
  }

  @Bean
  public GroupedOpenApi frontendApiV1() {

    return GroupedOpenApi.builder()
        .group("frontend-api-v1")
        .packagesToScan("mika.pawel.diabetesTreatmentReporter.controller")
        .addOpenApiCustomizer(openApi -> {
          if (openApi.getServers() != null) {
            openApi.getServers().clear();
          }
          openApi.getComponents().getSchemas().put(
              "Authority",
              new StringSchema()._enum(Arrays.stream(Authority.values())
                  .map(Authority::name)
                  .toList())
          );
        })
        .addOperationCustomizer((operation, handlerMethod) -> {
          operation.addExtension("x-codegen-request-body-name", "body");

          if (operation.getParameters() != null) {
            operation = operation.parameters(operation.getParameters()
                .stream()
                .peek(parameter -> {
                  if (parameter.getSchema() != null
                      && parameter.getSchema().getFormat() != null
                      && List.of("date", "date-time").contains(parameter.getSchema().getFormat())) {
                    parameter.getSchema().setFormat(null);
                  }
                })
                .collect(Collectors.toList()));
          }

          return operation;
        })
        .build();
  }
}

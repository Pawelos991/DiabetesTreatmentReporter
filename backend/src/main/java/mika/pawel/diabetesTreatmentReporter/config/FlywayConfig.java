package mika.pawel.diabetesTreatmentReporter.config;

import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

  @Bean
  @ConditionalOnProperty(value = "spring.datasource.flyway", havingValue = "true")
  public Flyway mainFlyway(@Qualifier("dataSource") DataSource dataSource) {
    var flyway = Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:db/migration/main")
        .outOfOrder(true)
        .load();
    flyway.migrate();
    return flyway;
  }
}

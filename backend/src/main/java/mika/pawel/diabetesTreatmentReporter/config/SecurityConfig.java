package mika.pawel.diabetesTreatmentReporter.config;

import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.security.JwtAuthenticationEntryPoint;
import mika.pawel.diabetesTreatmentReporter.security.JwtAuthenticationFilter;
import mika.pawel.diabetesTreatmentReporter.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableGlobalMethodSecurity(jsr250Enabled = true)
public class SecurityConfig {
  @Value("${apiV1}")
  private String apiPath;

  private final JwtAuthenticationEntryPoint unauthorizedHandler;
  private final UserDetailsService userDetailsService;
  private final JwtTokenProvider tokenProvider;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
        .cors()
        .and()
        .csrf()
        .disable()
        .exceptionHandling()
        .authenticationEntryPoint(unauthorizedHandler)
        .and()
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .userDetailsService(userDetailsService)
        .authorizeRequests()
        .requestMatchers(getWhitelistUrl())
        .permitAll()
        .anyRequest()
        .authenticated();

    http.addFilterBefore(jwtAuthenticationFilter(tokenProvider, userDetailsService), UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter(JwtTokenProvider tokenProvider,
                                                         UserDetailsService userDetailsService) {
    return new JwtAuthenticationFilter(tokenProvider, userDetailsService);
  }

  private String[] getWhitelistUrl() {
    return new String[]{
        apiPath.concat("/authentication"),
        apiPath.concat("/authentication/login"),
        apiPath.concat("/authentication/logout"),
        "/v3/api-docs/swagger-config",
        "/v3/api-docs/frontend-api-v1",
        "/actuator/metrics/**",
        "/actuator/**"
    };
  }

}

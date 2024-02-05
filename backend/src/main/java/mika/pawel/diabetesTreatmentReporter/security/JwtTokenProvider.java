package mika.pawel.diabetesTreatmentReporter.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;
import javax.crypto.spec.SecretKeySpec;
import mika.pawel.diabetesTreatmentReporter.service.CookieService;
import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Klasa dostarczająca funkcjonalność związaną z tokenami JWT.
 */
@Component
public class JwtTokenProvider {

  private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);
  public static final String SESSION_ID = "sessionId";
  public static final String ORIGINAL_SUB = "originalSub";
  public static final String PAWEL_MIKA = "PAWEL_MIKA";

  private final CookieService cookieService;

  @Value("${app.jwt-secret.internal:secret}")
  private String jwtSecret;

  @Value("${app.session.expiration-time:1800000}")
  private int jwtExpirationInMs;

  private Key signingKey;

  public JwtTokenProvider(CookieService cookieService) {
    this.cookieService = cookieService;
  }

  @PostConstruct
  public void init() {
    byte[] apiKeySecretBytes = DigestUtils.sha256(jwtSecret);
    signingKey = new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS256.getJcaName());
  }

  /**
   * Tworzy token JWT na podstawie przekazanych obiektów {@link UserPrincipal}.
   *
   * @return token JWT
   */
  public UserAuthenticationResult generateToken(UserPrincipal userPrincipal) {
    HashMap<String, Object> claims = new HashMap<>();
    claims.put(SESSION_ID, UUID.randomUUID().toString());
    claims.put(ORIGINAL_SUB, userPrincipal.getId());
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
    return new UserAuthenticationResult(Jwts.builder()
        .setIssuer(PAWEL_MIKA)
        .setClaims(claims)
        .setSubject(userPrincipal.getUsername())
        .setIssuedAt(new Date())
        .setExpiration(expiryDate)
        .setId(UUID.randomUUID().toString())
        .signWith(signingKey)
        .compact(),
        String.valueOf(expiryDate.getTime()));
  }

  public String refreshToken(UserPrincipal userPrincipal) {
    HashMap<String, Object> claims = new HashMap<>();
    claims.put(SESSION_ID, UUID.randomUUID().toString());
    claims.put(ORIGINAL_SUB, userPrincipal.getId());
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
    return Jwts.builder()
        .setIssuer(PAWEL_MIKA)
        .setClaims(claims)
        .setSubject(userPrincipal.getUsername())
        .setIssuedAt(new Date())
        .setExpiration(expiryDate)
        .setId(UUID.randomUUID().toString())
        .signWith(signingKey)
        .compact();
  }

  /**
   * Wyciąga token JWT z żądania HTTP.
   *
   * @param request żądanie HTTP
   * @return token JWT jako string
   */
  public String getTokenFromRequest(HttpServletRequest request) {
    Cookie cookie = cookieService.getCookieFromRequest(request);
    if (cookie != null) {
      return cookie.getValue();
    }
    return null;
  }

  /**
   * Pobiera login/email użytkownika z tokena JWT.
   *
   * @param token token JWT
   * @return id użytkownika
   */
  public String getUsernameFromJWT(String token) {

    Claims claims = Jwts.parser()
        .setSigningKey(signingKey)
        .build()
        .parseClaimsJws(token)
        .getBody();

    return claims.getSubject();
  }

  /**
   * Pobiera id oryginalnego użytkownika z tokena JWT.
   *
   * @param token token JWT
   * @return id oryginalnego użytkownika
   */
  public UUID getOriginalUserIdFromJWT(String token) {
    Claims claims = Jwts.parser()
        .setSigningKey(signingKey)
        .build()
        .parseClaimsJws(token)
        .getBody();

    String originalSub = claims.get(ORIGINAL_SUB, String.class);
    if (originalSub == null) {
      return null;
    }
    return UUID.fromString(originalSub);
  }

  /**
   * Pobiera id tokena z tokena JWT.
   *
   * @param token token JWT
   * @return id tokena
   */
  public String getTokenIdFromJWT(String token) {
    try {
      return Jwts.parser()
          .setSigningKey(signingKey)
          .build()
          .parseClaimsJws(token)
          .getBody()
          .get(SESSION_ID).toString();
    } catch (ExpiredJwtException e) {
      return e.getClaims().get(SESSION_ID).toString();
    }
  }

  public Date getTokenExpiryDate(String token) {
    return Jwts.parser().setSigningKey(signingKey).build().parseClaimsJws(token).getBody().getExpiration();
  }

  /**
   * Sprawdza poprawność tokena JWT.
   *
   * @param authToken token JWT
   * @return rezultat walidacji tokenu w postaci JWTValidationResult
   */
  public JWTValidationResult validateToken(String authToken) {
    try {
      Jwts.parser().setSigningKey(signingKey).build().parseClaimsJws(authToken);
      return JWTValidationResult.VALID;
    } catch (SecurityException ex) {
      logger.error("Invalid JWT signature");
      return JWTValidationResult.INVALID_SIGNATURE;
    } catch (MalformedJwtException ex) {
      logger.error("Invalid JWT token");
      return JWTValidationResult.INVALID_TOKEN;
    } catch (ExpiredJwtException ex) {
      logger.error("Expired JWT token");
      return JWTValidationResult.EXPIRED_TOKEN;
    } catch (UnsupportedJwtException ex) {
      logger.error("Unsupported JWT token");
      return JWTValidationResult.UNSUPPORTED_TOKEN;
    } catch (IllegalArgumentException ex) {
      logger.error("JWT claims string is empty.");
      return JWTValidationResult.OTHER_ERROR;
    }
  }
}

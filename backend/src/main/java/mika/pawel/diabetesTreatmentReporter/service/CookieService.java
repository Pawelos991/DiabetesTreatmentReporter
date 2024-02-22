package mika.pawel.diabetesTreatmentReporter.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

/**
 * Logika biznesowa związana z obsługą ciasteczek HTTP.
 */
@Service
public class CookieService {

  private static final String COOKIE_NAME = "DTR-TOKEN";

  @Value("${app.session.expiration-time:1800000}")
  private int sessionTimeInMs;

  /**
   * Zwraca ciasteczko HTTP zawierający dany token JWT.
   *
   * @param token token JWT
   * @return ciasteczko HTTP z tokenem JWT
   */
  public ResponseCookie createCookieWithToken(String token) {
    return ResponseCookie.from(COOKIE_NAME, token)
        .secure(false) //For local tests only
        .httpOnly(true)
        .path("/")
        .maxAge(sessionTimeInMs / 1000)
        .sameSite("Strict")
        .build();
  }

  /**
   * Zwraca ciasteczko z tokenem JWT z przekazanego requesta HTTP, o ile takowe istnieje.
   *
   * @param request request HTTP
   * @return ciasteczko HTTP z tokenem JWT
   */
  public Cookie getCookieFromRequest(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null && cookies.length > 0) {
      for (Cookie cookie : cookies) {
        if (COOKIE_NAME.equals(cookie.getName())) {
          return cookie;
        }
      }
    }
    return null;
  }

  /**
   * Zwraca ciasteczko HTTP z zerową datą ważności - służy do usunięcia ciastka po stronie klienta.
   *
   * @return ciasteczko HTTP z zerową datą ważności
   */
  public ResponseCookie createRemovalCookie() {
    return ResponseCookie.from(COOKIE_NAME, "")
        .secure(false)
        .httpOnly(true)
        .path("/")
        .maxAge(0)
        .sameSite("Strict")
        .build();
  }

  /**
   * Ustawia cookie do odpowiedzi http.
   *
   * @param response odpowiedź http
   */
  public void setCookieHeader(HttpServletResponse response, ResponseCookie cookie) {
    response.setHeader("Set-Cookie", cookie.toString());
  }

}

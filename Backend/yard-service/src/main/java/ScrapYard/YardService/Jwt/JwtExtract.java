package ScrapYard.YardService.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtExtract {

    @Value("${secret.Key}")
    private String secret;

    private SecretKey secretKey(){return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    };
    public Claims claims(String token){
        return Jwts.parserBuilder().setSigningKey(secretKey()).build().parseClaimsJws(token).getBody();
    }

}

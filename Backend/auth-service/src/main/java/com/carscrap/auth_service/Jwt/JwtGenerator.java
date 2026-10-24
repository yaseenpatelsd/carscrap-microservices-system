package com.carscrap.auth_service.Jwt;

import com.carscrap.auth_service.Entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtGenerator {

    @Value("${secret.Key}")
    private String secret;

   private SecretKey secretKey(){return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
   };
    long expireTime=1000L*60*60*25;

    public String jwtGenerator(UserEntity user){
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("username",user.getUsername())
                .claim("role",user.getRole())
                .setExpiration(new Date(System.currentTimeMillis()+expireTime))
                .setIssuedAt(new Date())
                .signWith(secretKey())
                .compact();
    }

     public Claims claims(String token){
        return Jwts.parserBuilder().setSigningKey(secretKey()).build().parseClaimsJws(token).getBody();
     }

    public Boolean isValid(String token){
        try {
            Jwts.parserBuilder().setSigningKey(secretKey()).build().parseClaimsJws(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}

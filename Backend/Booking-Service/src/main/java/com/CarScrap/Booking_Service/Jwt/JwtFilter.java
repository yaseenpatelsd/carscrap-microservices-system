package com.CarScrap.Booking_Service.Jwt;

import com.CarScrap.Booking_Service.Enum.Principal;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtExtract jwtExtract;

    public JwtFilter(JwtExtract jwtExtract) {
        this.jwtExtract = jwtExtract;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getRequestURI();

        return path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader=request.getHeader("Authorization");


        if (authHeader==null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }
        String token=authHeader.substring(7).trim();

        try {
            Claims claim = jwtExtract.claims(token);
            String username = claim.get("username", String.class);
            Long id = Long.valueOf(claim.getSubject());

            String role = claim.get("role").toString().trim();


            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

            Principal principal = new Principal(id, username, role);

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(principal, null, List.of(authority));

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }catch (Exception e){

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            System.out.println(e.getMessage());
            return;
        }

        filterChain.doFilter(request,response);
    }
}

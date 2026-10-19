package com.carscrap.auth_service.Util;


import com.carscrap.auth_service.Entity.UserEntity;
import com.carscrap.auth_service.Enum.UserRole;
import com.carscrap.auth_service.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.management.relation.Role;
import java.util.Optional;

@Component
public class RegisterOfSuperAdmin implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterOfSuperAdmin(UserRepository SAR, PasswordEncoder passwordEncoder) {
        this.userRepository = SAR ;
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${superadmin.password}")
    private String password;

    @Value("${superadmin.username}")
    private String username;

    @Value("${superadmin.name}")
    private String name;
    @Value("${superadmin.email}")
    private String email;

    @Override
    public void run(String... args) throws Exception {
        Optional<UserEntity> user= userRepository.findByUsername(username);

        if (user.isEmpty()){
            UserEntity superAdmin = new UserEntity();

            superAdmin.setUsername(username);
            superAdmin.setPassword(passwordEncoder.encode(password));
            superAdmin.setEmail(email);
            superAdmin.setOtp(null);
            superAdmin.setOtpExpiretime(null);
            superAdmin.setValid(true);

            superAdmin.setRole(UserRole.SUPER_ADMIN);

            userRepository.save(superAdmin);
        }
    }
}

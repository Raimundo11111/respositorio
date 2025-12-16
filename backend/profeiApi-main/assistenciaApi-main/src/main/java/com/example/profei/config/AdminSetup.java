package com.example.profei.config;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.profei.model.Usuario;
import com.example.profei.repository.UsuarioRepository;

@Component
public class AdminSetup implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Logger logger = LoggerFactory.getLogger(AdminSetup.class);

    public AdminSetup(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@local";
        String adminName = "Administrador";
        // Read admin password from either system property or env var (property takes precedence)
        String adminPassword = System.getProperty("app.adminPassword");
        if (adminPassword == null) adminPassword = System.getenv().getOrDefault("APP_ADMIN_PASSWORD", "admin123");

        // Force reset flag can come from system property or env var
        String forceReset = System.getProperty("app.forceResetAdmin");
        if (forceReset == null) forceReset = System.getenv().getOrDefault("APP_FORCE_RESET_ADMIN", "0");

        boolean exists = usuarioRepository.findAll().stream().anyMatch(u -> adminEmail.equals(u.getEmail()));
        if (!exists) {
            Usuario admin = new Usuario();
            admin.setNome(adminName);
            admin.setEmail(adminEmail);
            admin.setSenhaHash(passwordEncoder.encode(adminPassword));
            admin.setPerfil("ADMIN");
            admin.setCriadoEm(LocalDateTime.now());
            usuarioRepository.save(admin);
            logger.info("Usuário administrador criado: {} (senha from env or default)", adminEmail);
        } else {
            if ("1".equals(forceReset)) {
                Usuario admin = usuarioRepository.findAll().stream().filter(u -> adminEmail.equals(u.getEmail())).findFirst().get();
                admin.setSenhaHash(passwordEncoder.encode(adminPassword));
                usuarioRepository.save(admin);
                logger.info("Senha do administrador forçada para nova senha a partir de APP_ADMIN_PASSWORD");
            }
            logger.info("Usuário administrador já existe: {}", adminEmail);
        }
    }
}

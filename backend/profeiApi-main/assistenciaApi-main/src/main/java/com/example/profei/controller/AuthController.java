package com.example.profei.controller;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.profei.model.AuthToken;
import com.example.profei.model.Usuario;
import com.example.profei.repository.AuthTokenRepository;
import com.example.profei.repository.UsuarioRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final AuthTokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarioRepository, AuthTokenRepository tokenRepository) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        String email = body.get("email");
        String senha = body.get("senha");
        if (email == null || senha == null) return ResponseEntity.badRequest().body(Map.of("error","email/senha required"));
        Optional<Usuario> exists = usuarioRepository.findAll().stream().filter(u->email.equals(u.getEmail())).findFirst();
        if (exists.isPresent()) return ResponseEntity.badRequest().body(Map.of("error","email already exists"));
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setEmail(email);
        u.setSenhaHash(passwordEncoder.encode(senha));
        u.setPerfil("Usuario");
        usuarioRepository.save(u);
        return ResponseEntity.ok(Map.of("message","registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String senha = body.get("senha");
        if (email == null || senha == null) return ResponseEntity.badRequest().body(Map.of("error","email/senha required"));
        Optional<Usuario> userOpt = usuarioRepository.findAll().stream().filter(u->email.equals(u.getEmail())).findFirst();
        if (userOpt.isEmpty()) return ResponseEntity.status(401).body(Map.of("error","invalid credentials"));
        Usuario user = userOpt.get();
        if (!passwordEncoder.matches(senha, user.getSenhaHash())) return ResponseEntity.status(401).body(Map.of("error","invalid credentials"));
        String token = UUID.randomUUID().toString();
        AuthToken auth = new AuthToken(token, user);
        tokenRepository.save(auth);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
